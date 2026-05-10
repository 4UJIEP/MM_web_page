import API_URL from './apiClient';
import type { AuthUser } from '../context/AuthContext';

// ============================================
// AUTH API
// ============================================

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: AuthUser;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('mm_auth_token');
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options?.headers,
        },
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? response.statusText);
    }
    // 204 No Content
    if (response.status === 204) return {} as T;
    return response.json() as Promise<T>;
}


export const authApi = {

    /**
     * POST /auth/login
     * Возвращает JWT-токен и данные пользователя.
     */
    login: (credentials: LoginRequest): Promise<LoginResponse> =>
        apiFetch<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),

    /**
     * POST /auth/logout
     * Инвалидирует токен на сервере.
     */
    logout: (): Promise<void> =>
        apiFetch<void>('/auth/logout', { method: 'POST' }),

    /**
     * GET /auth/me
     * Проверяет токен и возвращает актуальные данные пользователя.
     * Вызывать при старте приложения если токен есть в localStorage.
     */
    me: (): Promise<AuthUser> =>
        apiFetch<AuthUser>('/auth/me'),
};

export async function loginUser(username: string, password: string): Promise<any> {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
    });
    return response.json();
};