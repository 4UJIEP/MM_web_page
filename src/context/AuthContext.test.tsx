import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import type { AuthUser } from './AuthContext';

// Мок localStorage — AuthContext его использует для сохранения пользователя
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const mockUser: AuthUser = {
    id: '1',
    name: 'Иван',
    surname: 'Иванов',
    patronymic: 'Иванович',
    username: 'ivanov',
    email: 'ivanov@mail.ru',
    role: 'parent',
};

const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('изначально пользователь не аутентифицирован', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
    });

    it('login сохраняет пользователя в состоянии', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        act(() => { result.current.login(mockUser); });
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user?.role).toBe('parent');
    });

    it('logout очищает данные пользователя', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        act(() => { result.current.login(mockUser); });
        act(() => { result.current.logout(); });
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
    });
});