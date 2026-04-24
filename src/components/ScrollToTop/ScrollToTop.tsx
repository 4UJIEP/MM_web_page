import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ============================================
// SCROLL TO TOP
// Сбрасывает скролл в начало страницы при
// каждом переходе между маршрутами.
// React Router не делает этого автоматически —
// без компонента страница открывается с той
// позиции скролла, на которой была предыдущая.
// ============================================

export const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // Ничего не рендерит — только side effect
    return null;
};