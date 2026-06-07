export const API_URL = "https://xn----btbeiralcm3b5ag4hub.xn--p1ai";

const TOKEN_KEY = "mm_auth_token";
const REFRESH_KEY = "mm_auth_refresh";

export const tokenStorage = {
    getAccess: () => localStorage.getItem(TOKEN_KEY),
    getRefresh: () => localStorage.getItem(REFRESH_KEY),
    save: (access: string, refresh: string) => {
        localStorage.setItem(TOKEN_KEY, access);
        localStorage.setItem(REFRESH_KEY, refresh);
    },
    clear: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
    },
};

async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = tokenStorage.getRefresh();
    if (!refreshToken) return null;

    try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`,
            },
        });

        if (!response.ok) return null;

        const data = await response.json();
        tokenStorage.save(data.access_token, refreshToken);
        return data.access_token;
    } catch {
        return null;
    }
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    let token = tokenStorage.getAccess();

    const makeRequest = async (accessToken: string | null) => {
        return fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                ...(options.headers ?? {}),
            },
        });
    };

    let response = await makeRequest(token);

    // Если 401 — пробуем обновить токен и повторить запрос
    if (response.status === 401) {
        const newToken = await refreshAccessToken();

        if (newToken) {
            // Повторяем запрос с новым токеном
            response = await makeRequest(newToken);
        } else {
            // Refresh тоже не работает — разлогиниваем
            tokenStorage.clear();
            localStorage.removeItem('mm_auth_user');
            window.location.href = '/';
            throw new Error('Unauthorized');
        }
    }

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.msg || err.error || `Ошибка ${response.status}`);
    }

    return response.json();
}

export default API_URL;