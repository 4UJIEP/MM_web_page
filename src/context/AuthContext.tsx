import { createContext, useContext, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { tokenStorage } from '../api/apiClient';

// ============================================
// TYPES
// ============================================

export type UserRole = 'parent' | 'child' | 'teacher';

export interface ChildInfo {
    id: string;
    name: string;        // имя ребёнка для отображения
    fullName: string;    // ФИО ребёнка
    classNumber: number;
    schoolName: string;
    avatarUrl?: string;
}

export interface AuthUser {
    id: string;
    name: string;
    surname: string;
    patronymic: string;
    username: string;
    email: string;
    role: UserRole;
    /** URL аватарки (опционально) */
    avatarUrl?: string;
    /** Телефон пользователя */
    phone?: string;
    /**
     * Только для role === 'parent' — список детей.
     * TODO: заполняется из GET /api/profile после авторизации.
     */
    children?: ChildInfo[];
}

interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
}

// ============================================
// storage helpers
// ============================================

const STORAGE_KEY = 'mm_auth_user';

function loadUserFromStorage(): AuthUser | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as AuthUser;
    } catch {
        // Повреждённые данные — сбрасываем
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}


function saveUserToStorage(userData: AuthUser): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch {
        // localStorage недоступен (приватный режим с ограничениями) — игнорируем
    }
}

function clearUserFromStorage(): void {
    localStorage.removeItem(STORAGE_KEY);
}

// ============================================
// CONTEXT
// ============================================

export const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================
// PROVIDER
// ============================================

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    // Инициализируем состояние из localStorage — пользователь остаётся
    // залогиненным после перезагрузки страницы
    const [user, setUser] = useState<AuthUser | null>(loadUserFromStorage);

    const login = (userData: AuthUser) => {
        saveUserToStorage(userData);
        setUser(userData);
    };

    const logout = () => {
        clearUserFromStorage();
        tokenStorage.clear(); // Очищаем токены при логауте
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// ============================================
// HOOK
// ============================================

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }
    return ctx;
};