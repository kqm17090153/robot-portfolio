import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://kvhxuemffupgaqdrfycx.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_kh-msyi2P0wGMedriFVZig_usFKfQ4j';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient | null {
  if (!supabaseClient) {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: { persistSession: false },
        });
      } catch (err) {
        console.warn('Failed to initialize Supabase server client:', err);
      }
    }
  }
  return supabaseClient;
}

export interface SupabaseSyncResult {
  success: boolean;
  source: 'supabase' | 'fallback';
  error?: string;
}

/**
 * Fetch portfolio data from Supabase table 'portfolio_data' (row with id='main')
 */
export async function fetchPortfolioFromSupabase(): Promise<{ data: any | null; error?: string }> {
  const client = getSupabaseServerClient();
  if (!client) {
    return { data: null, error: 'Supabase client not configured' };
  }

  try {
    const { data, error } = await client
      .from('portfolio_data')
      .select('data, updated_at')
      .eq('id', 'main')
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    if (data && data.data) {
      return { data: data.data };
    }

    return { data: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Unknown Supabase fetch error' };
  }
}

/**
 * Save / Upsert portfolio data to Supabase table 'portfolio_data'
 */
export async function savePortfolioToSupabase(portfolioData: any): Promise<SupabaseSyncResult> {
  const client = getSupabaseServerClient();
  if (!client) {
    return { success: false, source: 'fallback', error: 'Supabase client not configured' };
  }

  try {
    const { error } = await client
      .from('portfolio_data')
      .upsert(
        {
          id: 'main',
          data: portfolioData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.warn('Supabase upsert failed:', error.message);
      return { success: false, source: 'fallback', error: error.message };
    }

    return { success: true, source: 'supabase' };
  } catch (err: any) {
    console.warn('Supabase save error:', err);
    return { success: false, source: 'fallback', error: err?.message || 'Unknown save error' };
  }
}

/**
 * Check if the Supabase connection is working and if the table exists
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  tableExists: boolean;
  url: string;
  error?: string;
}> {
  const client = getSupabaseServerClient();
  if (!client) {
    return { connected: false, tableExists: false, url: SUPABASE_URL, error: 'Client not initialized' };
  }

  try {
    const { data, error } = await client
      .from('portfolio_data')
      .select('id')
      .limit(1);

    if (error) {
      // Table doesn't exist yet (Postgres code 42P01 or relation does not exist)
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('404')) {
        return {
          connected: true,
          tableExists: false,
          url: SUPABASE_URL,
          error: `Table 'portfolio_data' does not exist yet. Please run the SQL schema setup.`,
        };
      }
      return { connected: false, tableExists: false, url: SUPABASE_URL, error: error.message };
    }

    return { connected: true, tableExists: true, url: SUPABASE_URL };
  } catch (err: any) {
    return { connected: false, tableExists: false, url: SUPABASE_URL, error: err?.message || 'Connection failed' };
  }
}
