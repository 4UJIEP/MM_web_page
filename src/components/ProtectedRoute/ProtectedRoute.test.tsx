import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import type { AuthUser } from '../../context/AuthContext';

// Вспомогательная функция: рендерит маршрут с заданным состоянием аутентификации
function renderWithAuth(isAuthenticated: boolean, role?: AuthUser['role']) {
    const mockUser: AuthUser | null = isAuthenticated
        ? {
            id: '1',
            name: 'Иван',
            surname: 'Иванов',
            patronymic: 'Иванович',
            username: 'ivanov',
            email: 'ivanov@mail.ru',
            role: role ?? 'parent',
        }
        : null;

    return render(
        <AuthContext.Provider
            value={{
                user: mockUser,
                isAuthenticated,
                login: () => { },
                logout: () => { },
            }}
        >
            <MemoryRouter initialEntries={['/cabinet']}>
                <Routes>
                    <Route path="/" element={<div>Главная</div>} />
                    <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                        <Route path="/cabinet" element={<div>Кабинет учителя</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>
    );
}

describe('ProtectedRoute', () => {
    it('перенаправляет на главную неаутентифицированного пользователя', () => {
        renderWithAuth(false);
        expect(screen.getByText('Главная')).toBeInTheDocument();
        expect(screen.queryByText('Кабинет учителя')).not.toBeInTheDocument();
    });

    it('блокирует доступ при несовместимой роли (parent вместо teacher)', () => {
        renderWithAuth(true, 'parent');
        expect(screen.queryByText('Кабинет учителя')).not.toBeInTheDocument();
    });

    it('разрешает доступ пользователю с корректной ролью (teacher)', () => {
        renderWithAuth(true, 'teacher');
        expect(screen.getByText('Кабинет учителя')).toBeInTheDocument();
    });
});