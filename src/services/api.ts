import { FullPortfolioData } from '../../server/db';
import {
  heroContent,
  skillsData,
  trialLogsData,
  timelineEventsData,
  projectsData,
} from '../data/portfolioData';

const TOKEN_KEY = 'robotfolio_admin_jwt';

export const fallbackPortfolioData: FullPortfolioData = {
  heroContent,
  skillsData,
  trialLogsData,
  timelineEventsData,
  projectsData,
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

export async function fetchPortfolioData(): Promise<FullPortfolioData> {
  try {
    const res = await fetch('/api/portfolio');
    if (!res.ok) {
      throw new Error(`Failed to fetch portfolio: ${res.status}`);
    }
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return fallbackPortfolioData;
  } catch (err) {
    console.warn('Using fallback local portfolio data:', err);
    return fallbackPortfolioData;
  }
}

export async function loginAdminApi(username: string, password: string): Promise<{
  success: boolean;
  token?: string;
  user?: { id: string; username: string; name: string; role: string };
  error?: string;
}> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || '로그인에 실패했습니다.' };
    }

    if (data.token) {
      setStoredToken(data.token);
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (err: any) {
    return {
      success: false,
      error: '서버와 통신할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    };
  }
}

export async function checkAdminSession(): Promise<{
  authenticated: boolean;
  user?: { id: string; username: string; name: string; role: string };
}> {
  const token = getStoredToken();
  try {
    const res = await fetch('/api/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      setStoredToken(null);
      return { authenticated: false };
    }

    const data = await res.json();
    if (data.success && data.user) {
      return { authenticated: true, user: data.user };
    }
    return { authenticated: false };
  } catch (err) {
    return { authenticated: false };
  }
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
  }
}

export async function savePortfolioApi(data: Partial<FullPortfolioData>): Promise<{
  success: boolean;
  data?: FullPortfolioData;
  error?: string;
}> {
  const token = getStoredToken();
  try {
    const res = await fetch('/api/portfolio', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return {
        success: false,
        error: json.error || '포트폴리오 저장에 실패했습니다.',
      };
    }

    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: '서버 통신 중 오류가 발생했습니다.' };
  }
}

export async function resetPortfolioApi(): Promise<{
  success: boolean;
  data?: FullPortfolioData;
  error?: string;
}> {
  const token = getStoredToken();
  try {
    const res = await fetch('/api/portfolio/reset', {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return {
        success: false,
        error: json.error || '초기화에 실패했습니다.',
      };
    }

    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: '서버 통신 중 오류가 발생했습니다.' };
  }
}
