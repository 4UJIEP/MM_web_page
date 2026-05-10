import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

import styles from './Header.module.css';
import { LoginModal } from '../ui/LoginModal';
import { useAuth } from '../../context/AuthContext';

import logo from '../../assets/logoMM.png';
import { LogoutConfirmModal } from '../ui/LogoutConfirmModal';

// ============================================
// НАВИГАЦИЯ ЛК (видна только залогиненным)
// ============================================

const cabinetNavItems = [
    { id: 'profile', label: 'Профиль', href: '/cabinet/profile' },
    { id: 'schedule', label: 'Расписание', href: '/cabinet/schedule' },
    { id: 'journal', label: 'Журнал', href: '/cabinet/journal' },
    { id: 'notifications', label: 'Уведомления', href: '/cabinet/notifications' },
];

// Для преподавателя — те же разделы, но без лишних пунктов.
// Журнал у преподавателя — список групп и посещаемость.
const teacherNavItems = [
    { id: 'profile', label: 'Профиль', href: '/cabinet/profile' },
    { id: 'schedule', label: 'Расписание', href: '/cabinet/schedule' },
    { id: 'journal', label: 'Журнал', href: '/cabinet/journal' },
    { id: 'notifications', label: 'Уведомления', href: '/cabinet/notifications' },
];

const publicNavItems = [
    { id: 'courses', label: 'Курсы', href: '/courses' },
    { id: 'teachers', label: 'Наши преподаватели', href: '/teachers' },
    { id: 'olympiads', label: 'Олимпиады', href: '/olympiads' },
    { id: 'schedule', label: 'Расписание', href: '/schedule' },
    { id: 'news', label: 'Новости', href: '/news' },
    { id: 'contacts', label: 'Контакты', href: '/contacts' },
];

// ============================================
// USER DROPDOWN MENU
// w:382 h:169 br:16 bg:#fff
// inner: w:374 top:16 left:4 gap:12
// ============================================

interface UserDropdownProps {
    fullName: string;
    initials: string;
    avatarUrl?: string;
    /** Координаты правого края кнопки для позиционирования */
    anchorRight: number;
    anchorTop: number;
    onProfile: () => void;
    onAddAccount: () => void;
    onLogout: () => void;
    onClose: () => void;
}

const UserDropdown: FC<UserDropdownProps> = ({
    fullName, initials, avatarUrl,
    anchorRight, anchorTop,
    onProfile, onAddAccount, onLogout, onClose,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    // Закрытие по клику вне
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    // Закрытие по Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    // Портал — рендерим в <body>, чтобы дропдаун был поверх любых элементов
    // position:fixed + координаты от кнопки через getBoundingClientRect
    return createPortal(
        <div
            className={styles.dropdown}
            ref={ref}
            role="menu"
            style={{
                position: 'fixed',
                top: anchorTop + 8,
                right: anchorRight,
            }}
        >

            {/* inner — w:374 top:16 left:4 gap:12 */}
            <div className={styles.dropdownInner}>

                {/* ── ФИО + аватарка — w:374 h:42 ──────────── */}
                {/* ФИО: w:244 h:23 left:58  Аватарка: w:42 h:42 left:310 */}
                <button
                    className={styles.dropdownProfile}
                    onClick={onProfile}
                    role="menuitem"
                    aria-label="Перейти в профиль"
                >
                    <span className={styles.dropdownName}>{fullName}</span>
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={fullName} className={styles.dropdownAvatar} />
                    ) : (
                        <div className={styles.dropdownAvatarPlaceholder} aria-hidden="true">
                            {initials}
                        </div>
                    )}
                </button>

                {/* ── Блок «Добавить аккаунт» — w:374 h:48 gap:11 ── */}
                {/* Сверху и снизу линии 2px solid #3E404433 */}
                <div className={styles.dropdownAddSection}>

                    {/* Линия сверху */}
                    <hr className={styles.dropdownLine} />

                    {/* «+ Добавить аккаунт» — w:209 h:24 Roboto 500 20px #3E4044 */}
                    <button
                        className={styles.dropdownAddAccount}
                        onClick={onAddAccount}
                        role="menuitem"
                    >
                        + Добавить аккаунт
                    </button>

                    {/* Линия снизу */}
                    <hr className={styles.dropdownLine} />

                </div>

                {/* ── Выйти из аккаунта — w:374 h:24 Roboto 500 20px #E82346 ── */}
                <button
                    className={styles.dropdownLogout}
                    onClick={onLogout}
                    role="menuitem"
                >
                    Выйти из аккаунта
                </button>

            </div>
        </div>,
        document.body
    );
};

// ============================================
// HEADER
// ============================================

export const Header: FC = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const { user, isAuthenticated, login, logout } = useAuth();
    const navigate = useNavigate();
    // Ref на кнопку-триггер для вычисления позиции дропдауна
    const userButtonRef = useRef<HTMLButtonElement>(null);

    const handleLoginClick = () => setIsLoginModalOpen(true);
    const handleCloseModal = () => setIsLoginModalOpen(false);

    const location = useLocation();

    const handleLogin = (_login: string, _password: string) => {

        // ── DEMO-режим (без бека) ────────────────────────────────────
        // Три логина для демонстрации трёх ролей.
        // Пароль любой.
        // Удалить и заменить на реальный API когда бек будет готов.
        const DEMO_USERS: Record<string, Parameters<typeof login>[0]> = {
            teacher: {
                id: 'demo-teacher',
                name: 'Препод',
                surname: 'Преподаватель',
                patronymic: 'Преподавательевич',
                username: 'teacher',
                email: 'teacher@matfak.ru',
                role: 'teacher',
                phone: '+7 (999) 000-00-00',
            },
            parent: {
                id: 'demo-parent',
                name: 'Папа',
                surname: 'Васи Пупкина',
                patronymic: '',
                username: 'parent',
                email: 'parent@matfak.ru',
                role: 'parent',
                phone: '+7 904 076 94 72',
                children: [
                    { id: 'child-1', name: 'Вася', fullName: 'Пупкин Василий Мупкин', classNumber: 9, schoolName: 'Школа №1' },
                    { id: 'child-2', name: 'Катя', fullName: 'Пупкина Катерина Мупкина', classNumber: 3, schoolName: 'Школа №1' },
                ],
            },
            child: {
                id: 'demo-child',
                name: 'Василий',
                surname: 'Пупкин',
                patronymic: 'Мупкин',
                username: 'child',
                email: 'child@matfak.ru',
                role: 'child',
                phone: '',
            },
        };

        const demoUser = DEMO_USERS[_login];
        if (demoUser) {
            login(demoUser);
        } else {
            // Если логин не из списка — входим как ребёнок с введённым именем
            login({
                id: 'demo-child',
                name: _login,
                surname: '',
                patronymic: '',
                username: _login,
                email: '',
                role: 'child',
            });
        }

        setIsLoginModalOpen(false);
        const from = (location.state as { from?: Location })?.from?.pathname;
        navigate(from ?? '/cabinet/schedule');
    };

    const handleLogout = () => {
        // Открываем подтверждение вместо немедленного выхода
        setIsDropdownOpen(false);
        setIsLogoutConfirmOpen(true);
    };

    const handleLogoutConfirm = () => {
        logout();
        setIsLogoutConfirmOpen(false);
        navigate('/');
    };

    const handleLogoutCancel = () => {
        setIsLogoutConfirmOpen(false);
    };

    const handleGoToProfile = () => {
        setIsDropdownOpen(false);
        navigate('/cabinet/profile');
    };

    const handleAddAccount = () => {
        // TODO: логика добавления второго аккаунта
        setIsDropdownOpen(false);
        setIsLoginModalOpen(true);
    };

    const fullName = user
        ? `${user.surname} ${user.name} ${user.patronymic}`
        : '';

    const initials = user
        ? `${user.surname[0]}${user.name[0]}`
        : '';

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>

                    {/* ── Левая часть ─────────────────────────────────── */}
                    <div className={styles.leftSection}>
                        <Link to="/" className={styles.logoLink}>
                            <img src={logo} alt="Малый Матфак" className={styles.logoImage} />
                        </Link>

                        <nav className={styles.nav}>
                            {isAuthenticated
                                ? (user?.role === 'teacher' ? teacherNavItems : cabinetNavItems).map((item) => (
                                    <NavLink
                                        key={item.id}
                                        to={item.href}
                                        end
                                        className={({ isActive }) =>
                                            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                ))
                                : publicNavItems.map((item) => (
                                    <NavLink
                                        key={item.id}
                                        to={item.href}
                                        end
                                        className={({ isActive }) =>
                                            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                ))
                            }
                        </nav>
                    </div>

                    {/* ── Правая часть ─────────────────────────────────── */}
                    <div className={styles.rightSection}>
                        {isAuthenticated ? (
                            /* Обёртка с position:relative для позиционирования дропдауна */
                            <div className={styles.userBlockWrapper}>

                                {/* Кнопка — w:297 h:42 gap:11 */}
                                <button
                                    className={styles.userBlock}
                                    onClick={() => setIsDropdownOpen(o => !o)}
                                    aria-haspopup="menu"
                                    aria-expanded={isDropdownOpen}
                                    title="Меню аккаунта"
                                >
                                    <span className={styles.userName}>{fullName}</span>
                                    {user?.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl}
                                            alt={fullName}
                                            className={styles.avatar}
                                        />
                                    ) : (
                                        <div className={styles.avatarPlaceholder} aria-hidden="true">
                                            {initials}
                                        </div>
                                    )}
                                </button>

                                {/* Дропдаун — появляется под блоком пользователя */}
                                {isDropdownOpen && (() => {
                                    const rect = userButtonRef.current?.getBoundingClientRect();
                                    const anchorTop = rect ? rect.bottom : 80;
                                    const anchorRight = rect ? window.innerWidth - rect.right : 64;
                                    return (
                                        <UserDropdown
                                            fullName={fullName}
                                            initials={initials}
                                            avatarUrl={user?.avatarUrl}
                                            anchorTop={anchorTop}
                                            anchorRight={anchorRight}
                                            onProfile={handleGoToProfile}
                                            onAddAccount={handleAddAccount}
                                            onLogout={handleLogout}
                                            onClose={() => setIsDropdownOpen(false)}
                                        />
                                    );
                                })()}

                            </div>
                        ) : (
                            <button
                                className={styles.profileLink}
                                onClick={handleLoginClick}
                            >
                                Личный кабинет
                            </button>
                        )}
                    </div>

                </div>
            </header>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={handleCloseModal}
                onLogin={handleLogin}
            />

            {/* Модалка подтверждения выхода */}
            <LogoutConfirmModal
                isOpen={isLogoutConfirmOpen}
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
            />
        </>
    );
};