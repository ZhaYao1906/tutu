import type { AuthUser, DailyRecord } from '../types';

const API_BASE = 'http://localhost:8080/api';
const TOKEN_KEY = 'tutu_token';

// 后端统一响应格式
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Token 管理
class TokenManager {
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// 封装 fetch 请求，自动携带 JWT token
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = TokenManager.getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  // 401 未授权：清除 token 并跳转登录
  if (response.status === 401) {
    TokenManager.removeToken();
    window.location.href = '/';
    throw new Error('未授权，请重新登录');
  }

  if (!response.ok) {
    let errorMessage = `请求失败 (${response.status})`;
    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      // 响应体非 JSON，使用默认错误信息
    }
    throw new Error(errorMessage);
  }

  const body: ApiResponse<T> = await response.json();

  if (!body.success) {
    throw new Error(body.message || '请求失败');
  }

  return body.data;
}

// JWT 响应类型（后端 JwtResponse）
interface JwtResponseData {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  avatar: string;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string; user: AuthUser }> => {
    const response = await request<JwtResponseData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    TokenManager.setToken(response.token);
    // 获取完整用户信息
    const user = await userApi.getProfile();
    return { token: response.token, user };
  },

  register: async (username: string, email: string, password: string, avatar?: string): Promise<{ token: string; user: AuthUser }> => {
    const response = await request<JwtResponseData>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, avatar }),
    });
    TokenManager.setToken(response.token);
    // 获取完整用户信息
    const user = await userApi.getProfile();
    return { token: response.token, user };
  },
};

// User API
export const userApi = {
  getProfile: () => request<AuthUser>('/user/profile', { method: 'GET' }),

  updateProfile: (updates: object) =>
    request<AuthUser>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  getLevelInfo: () =>
    request<AuthUser & { nextLevelXp?: number; levelProgress?: number }>('/user/level-info', {
      method: 'GET',
    }),

  getLeaderboard: () => request<unknown[]>('/user/leaderboard', { method: 'GET' }),
};

// Spots API
export const spotsApi = {
  getAll: () => request<unknown[]>('/spots', { method: 'GET' }),

  visit: (spotId: number) =>
    request<unknown>(`/spots/${spotId}/visit`, { method: 'POST' }),
};

// Quests API
export const questsApi = {
  getAll: () => request<unknown[]>('/quests', { method: 'GET' }),

  getByDate: (date: string) =>
    request<unknown[]>(`/quests/date/${date}`, { method: 'GET' }),

  create: (quest: object) =>
    request<unknown>('/quests', {
      method: 'POST',
      body: JSON.stringify(quest),
    }),

  updateStatus: (questId: number, status: string) =>
    request<unknown>(`/quests/${questId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Daily Records API
export const dailyRecordApi = {
  getAll: () => request<DailyRecord[]>('/daily-records', { method: 'GET' }),

  getByDate: (date: string) =>
    request<DailyRecord>(`/daily-records/${date}`, { method: 'GET' }),

  getByMonth: (yearMonth: string) =>
    request<DailyRecord[]>(`/daily-records/month/${yearMonth}`, { method: 'GET' }),

  createOrUpdate: (record: object) =>
    request<DailyRecord>('/daily-records', {
      method: 'POST',
      body: JSON.stringify(record),
    }),

  delete: (id: number) =>
    request<unknown>(`/daily-records/${id}`, { method: 'DELETE' }),
};

// Accounts API
export const accountApi = {
  getAll: () => request<unknown[]>('/accounts', { method: 'GET' }),

  create: (account: object) =>
    request<unknown>('/accounts', {
      method: 'POST',
      body: JSON.stringify(account),
    }),

  getStats: (month?: string) =>
    request<unknown>(`/accounts/stats${month ? `?month=${month}` : ''}`, {
      method: 'GET',
    }),
};

export { TokenManager };
