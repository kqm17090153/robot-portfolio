import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FullPortfolioData } from '../../server/db';

export const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL || 'https://kvhxuemffupgaqdrfycx.supabase.co';
export const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_kh-msyi2P0wGMedriFVZig_usFKfQ4j';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseClient && SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false },
      });
    } catch (e) {
      console.warn('Supabase client init failed on browser:', e);
    }
  }
  return supabaseClient;
}

export const SUPABASE_SETUP_SQL = `-- Supabase SQL Editor에서 실행할 테이블 생성 쿼리
CREATE TABLE IF NOT EXISTS public.portfolio_data (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) 활성화 및 누구나 읽고 쓸 수 있도록 정책 추가
ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select portfolio" ON public.portfolio_data;
CREATE POLICY "Public select portfolio" ON public.portfolio_data FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert portfolio" ON public.portfolio_data;
CREATE POLICY "Public insert portfolio" ON public.portfolio_data FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update portfolio" ON public.portfolio_data;
CREATE POLICY "Public update portfolio" ON public.portfolio_data FOR UPDATE USING (true);
`;

/**
 * Fetch directly from Supabase on the browser
 */
export async function fetchPortfolioFromClientSupabase(): Promise<FullPortfolioData | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('portfolio_data')
      .select('data, updated_at')
      .eq('id', 'main')
      .maybeSingle();

    if (error) {
      console.warn('Browser Supabase query note:', error.message);
      return null;
    }

    if (data && data.data) {
      return data.data as FullPortfolioData;
    }
    return null;
  } catch (err) {
    console.warn('Browser Supabase fetch error:', err);
    return null;
  }
}

/**
 * Save directly to Supabase from browser as a double-safety sync layer
 */
export async function savePortfolioToClientSupabase(portfolio: FullPortfolioData): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('portfolio_data')
      .upsert(
        {
          id: 'main',
          data: portfolio,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.warn('Browser Supabase direct save note:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Browser Supabase direct save exception:', err);
    return false;
  }
}

/**
 * Test Supabase connectivity on client
 */
export async function checkClientSupabaseStatus(): Promise<{
  connected: boolean;
  tableExists: boolean;
  error?: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { connected: false, tableExists: false, error: '클라이언트 초기화 실패' };
  }

  try {
    const { error } = await client
      .from('portfolio_data')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('404')) {
        return { connected: true, tableExists: false, error: 'portfolio_data 테이블이 아직 생성되지 않았습니다.' };
      }
      return { connected: false, tableExists: false, error: error.message };
    }

    return { connected: true, tableExists: true };
  } catch (err: any) {
    return { connected: false, tableExists: false, error: err?.message || '연결 실패' };
  }
}
