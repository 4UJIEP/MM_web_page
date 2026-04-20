import { createContext, useContext, useState } from 'react';
import type { FC, ReactNode } from 'react';

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
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================
// PROVIDER
// ============================================

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);

    const login = (userData: AuthUser) => {
        setUser(userData);
    };

    const logout = () => {
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