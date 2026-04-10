import type { FC, ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';


export type UserRole = 'parent' | 'child' | 'teacher';

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
}

interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

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

// Хук для удобного доступа к контексту аутентификации


export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }
    return ctx;
};