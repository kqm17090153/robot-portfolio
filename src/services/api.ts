import { FullPortfolioData } from '../../server/db';
import {
  heroContent,
  skillsData,
  trialLogsData,
  timelineEventsData,
  projectsData,
  bgmConfig,
} from '../data/portfolioData';

const TOKEN_KEY = 'robotfolio_admin_jwt';
const LOCAL_STORAGE_DATA_KEY = 'robotfolio_custom_portfolio_data';
const LOCAL_SESSION_USER_KEY = 'robotfolio_local_admin_session';

export const fallbackPortfolioData: FullPortfolioData = {
  heroContent,
  skillsData,
  trialLogsData,
  timelineEventsData,
  projectsData,
  bgmConfig,
  updatedAt: new Date().toISOString(),
};

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// Get saved custom portfolio data from localStorage if exists
export function getLocalStoredPortfolio(): FullPortfolioData | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading local portfolio data:', e);
  }
  return null;
}

export function setLocalStoredPortfolio(data: FullPortfolioData | null): void {
  try {
    if (data) {
      localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_DATA_KEY);
    }
  } catch (e) {
    console.warn('Error saving local portfolio data:', e);
  }
}

export function mergeWithDefaults(data: Partial<FullPortfolioData> | null | undefined): FullPortfolioData {
  if (!data) return fallbackPortfolioData;

  return {
    heroContent: {
      badge: {
        ko: data.heroContent?.badge?.ko || heroContent.badge.ko,
        en: data.heroContent?.badge?.en || heroContent.badge.en,
      },
      headline: {
        ko: {
          prefix: data.heroContent?.headline?.ko?.prefix ?? heroContent.headline.ko.prefix,
          highlight: data.heroContent?.headline?.ko?.highlight ?? heroContent.headline.ko.highlight,
        },
        en: {
          prefix: data.heroContent?.headline?.en?.prefix ?? heroContent.headline.en.prefix,
          highlight: data.heroContent?.headline?.en?.highlight ?? heroContent.headline.en.highlight,
        },
      },
      bioItems: data.heroContent?.bioItems && data.heroContent.bioItems.length >= 2
        ? data.heroContent.bioItems
        : heroContent.bioItems,
      cta: {
        viewProjects: {
          ko: data.heroContent?.cta?.viewProjects?.ko || heroContent.cta.viewProjects.ko,
          en: data.heroContent?.cta?.viewProjects?.en || heroContent.cta.viewProjects.en,
        },
        simulation: {
          ko: data.heroContent?.cta?.simulation?.ko || heroContent.cta.simulation.ko,
          en: data.heroContent?.cta?.simulation?.en || heroContent.cta.simulation.en,
        },
      },
    },
    skillsData: data.skillsData && data.skillsData.length > 0 ? data.skillsData : skillsData,
    trialLogsData: data.trialLogsData && data.trialLogsData.length > 0 ? data.trialLogsData : trialLogsData,
    timelineEventsData: data.timelineEventsData && data.timelineEventsData.length > 0 ? data.timelineEventsData : timelineEventsData,
    projectsData: data.projectsData && data.projectsData.length > 0 ? data.projectsData : projectsData,
    bgmConfig: data.bgmConfig || bgmConfig,
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

export async function fetchPortfolioData(): Promise<FullPortfolioData> {
  const localSaved = getLocalStoredPortfolio();

  try {
    const res = await fetch('/api/portfolio', {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const serverData: FullPortfolioData = mergeWithDefaults(json.data);

        // If local data exists and is newer than server data, keep local and attempt silent sync
        if (localSaved && localSaved.updatedAt && serverData.updatedAt) {
          const localTime = new Date(localSaved.updatedAt).getTime();
          const serverTime = new Date(serverData.updatedAt).getTime();

          if (localTime > serverTime) {
            const mergedLocal = mergeWithDefaults(localSaved);
            return mergedLocal;
          }
        }

        // Server data is fresh and authority, update local cache
        setLocalStoredPortfolio(serverData);
        return serverData;
      }
    }
  } catch (err) {
    console.warn('Backend API unreachable, using local storage or fallback:', err);
  }

  // Fallback to local stored data or initial defaults
  return mergeWithDefaults(localSaved || fallbackPortfolioData);
}

export async function loginAdminApi(username: string, password: string): Promise<{
  success: boolean;
  token?: string;
  user?: { id: string; username: string; name: string; role: string };
  error?: string;
}> {
  const cleanUsername = username.trim();
  const cleanPassword = password.trim();

  // 1. Try server API login
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: cleanUsername, password: cleanPassword }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        if (data.token) {
          setStoredToken(data.token);
        }
        localStorage.setItem(
          LOCAL_SESSION_USER_KEY,
          JSON.stringify(data.user || { id: 'admin-1', username: cleanUsername, name: '김규민 (Admin)', role: 'admin' })
        );
        return {
          success: true,
          token: data.token,
          user: data.user,
        };
      }
    }
  } catch (err: any) {
    console.warn('Server login failed or unreachable, trying credential check fallback:', err);
  }

  // 2. Client-side verified fallback (kqm0125 / $$$q0125)
  if (cleanUsername === 'kqm0125' && cleanPassword === '$$$q0125') {
    const adminUser = {
      id: 'admin-1',
      username: 'kqm0125',
      name: '김규민 (Admin)',
      role: 'admin',
    };
    const fallbackToken = 'client-fallback-jwt-session-' + Date.now();
    setStoredToken(fallbackToken);
    localStorage.setItem(LOCAL_SESSION_USER_KEY, JSON.stringify(adminUser));

    return {
      success: true,
      token: fallbackToken,
      user: adminUser,
    };
  }

  return {
    success: false,
    error: '아이디 또는 비밀번호가 올바르지 않습니다.',
  };
}

export async function checkAdminSession(): Promise<{
  authenticated: boolean;
  user?: { id: string; username: string; name: string; role: string };
}> {
  const token = getStoredToken();
  if (!token) {
    return { authenticated: false };
  }

  // Check server session if possible
  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        return { authenticated: true, user: data.user };
      }
    }
  } catch (err) {
    // Continue to check local session
  }

  // Check stored local session user
  try {
    const savedUserRaw = localStorage.getItem(LOCAL_SESSION_USER_KEY);
    if (savedUserRaw) {
      const savedUser = JSON.parse(savedUserRaw);
      if (savedUser && savedUser.username === 'kqm0125') {
        return { authenticated: true, user: savedUser };
      }
    }
  } catch (e) {
    // Ignore JSON error
  }

  return { authenticated: false };
}

export async function logoutAdminApi(): Promise<void> {
  const token = getStoredToken();
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (e) {
    // Ignore error
  } finally {
    setStoredToken(null);
    localStorage.removeItem(LOCAL_SESSION_USER_KEY);
  }
}

export async function savePortfolioApi(data: Partial<FullPortfolioData>): Promise<{
  success: boolean;
  data?: FullPortfolioData;
  error?: string;
}> {
  const token = getStoredToken();

  // Update local storage immediately to ensure changes are NEVER lost
  const current = getLocalStoredPortfolio() || fallbackPortfolioData;
  const merged: FullPortfolioData = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  setLocalStoredPortfolio(merged);

  // Also attempt to save to server
  try {
    const res = await fetch('/api/portfolio', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        setLocalStoredPortfolio(json.data);
        return { success: true, data: json.data };
      }
    }
  } catch (err: any) {
    console.warn('Server save failed, using local storage state:', err);
  }

  // Successfully saved to local storage even if server was offline
  return { success: true, data: merged };
}

export async function resetPortfolioApi(): Promise<{
  success: boolean;
  data?: FullPortfolioData;
  error?: string;
}> {
  const token = getStoredToken();
  setLocalStoredPortfolio(fallbackPortfolioData);

  try {
    const res = await fetch('/api/portfolio/reset', {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return { success: true, data: json.data };
      }
    }
  } catch (err: any) {
    console.warn('Server reset failed, reset local storage state:', err);
  }

  return { success: true, data: fallbackPortfolioData };
}

