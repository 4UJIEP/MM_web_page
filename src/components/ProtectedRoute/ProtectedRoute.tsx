import type { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ============================================
// PROTECTED ROUTE
// Оборачивает маршруты личного кабинета.
// Незалогиненный пользователь → редирект на «/»
// с сохранением пути в state (чтобы вернуть
// его после входа).
// ============================================

interface ProtectedRouteProps {
    /** Если передан — разрешён только этот role.
     *  Не передан — любой авторизованный. */
    allowedRoles?: Array<'parent' | 'child' | 'teacher'>;
    /** Куда редиректить незалогиненных (по умолч. '/') */
    redirectTo?: string;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
    allowedRoles,
    redirectTo = '/',
}) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    // Не залогинен → на главную, запоминаем откуда пришли
    if (!isAuthenticated) {
        return (
            <Navigate
                to={redirectTo}
                state={{ from: location }}
                replace
            />
        );
    }

    // Залогинен, но роль не подходит → тоже редирект
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to={redirectTo} replace />;
    }

    // Всё ок — рендерим вложенные маршруты
    return <Outlet />;
};