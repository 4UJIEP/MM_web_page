import type { FC } from "react";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { LoginModal } from "../ui/LoginModal";
import { useAuth } from "../../context/AuthContext";

import logo from '../../assets/logoMM.png';
import avatarUrl  from '../../assets/ava.png';

interface CabinetNavItem {
    id: string;
    label: string;
    href: string;
}

// Типизируем пункты меню
interface NavItem {
    id: string;
    label: string;
    href: string;
}

const cabinetNavItems: CabinetNavItem[] = [
    { id: 'profile', label: 'Профиль', href: '/cabinet/profile' },
    { id: 'schedule', label: 'Расписание', href: '/cabinet/schedule' },
    { id: 'journal', label: 'Журнал', href: '/cabinet/journal' },
    { id: 'notifications', label: 'Уведомления', href: '/cabinet/notifications' },
];

// пункты навигации
const publicNavItems: NavItem[] = [
    { id: 'courses', label: 'Курсы', href: '/courses' },
    { id: 'teachers', label: 'Наши преподаватели', href: '/teachers' },
    { id: 'olympiads', label: 'Олимпиады', href: '/olympiads' },
    { id: 'news', label: 'Новости', href: '/news' },
    { id: 'contacts', label: 'Контакты', href: '/contacts' },
];

export const Header: FC = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { user, isAuthenticated, login, logout } = useAuth();
    const navigate = useNavigate(); // Для навигации при клике на пункты меню

    const handleLoginClick = () => {
        setIsLoginModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsLoginModalOpen(false);
    };
    // TODO: заменить на реальный API-запрос
    const handleLogin = (_login: string, _password: string) => {
        // Мок-пользователь для разработки
        login({
            id: 'mock-id',
            name: 'Василий',
            surname: 'Пупкин',
            patronymic: 'Мупкин',
            username: _login,
            email: 'test@example.com',
            role: 'child',
        });
        setIsLoginModalOpen(false);
        navigate('/cabinet/schedule');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    /** Полное ФИО */
    const fullName = user
        ? `${user.surname} ${user.name} ${user.patronymic}`
        : '';

    /** Инициалы для аватарки-заглушки */
    const initials = user
        ? `${user.surname[0]}${user.name[0]}`
        : '';

return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
 
          {/* Левая часть */}
          <div className={styles.leftSection}>
            <Link to="/" className={styles.logoLink}>
              <img
                src={logo}
                alt="Малый Матфак"
                className={styles.logoImage}
              />
            </Link>
 
            {/* Навигация меняется в зависимости от авторизации */}
            <nav className={styles.nav}>
              {isAuthenticated
                ? cabinetNavItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.href}
                      className={styles.navLink}
                    >
                      {item.label}
                    </Link>
                  ))
                : publicNavItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.href}
                      className={styles.navLink}
                    >
                      {item.label}
                    </Link>
                  ))
              }
            </nav>
          </div>
 
          {/* Правая часть */}
          <div className={styles.rightSection}>
            {isAuthenticated ? (
              /* Блок пользователя  */
              <button
                className={styles.userBlock}
                onClick={handleLogout}
                title="Нажмите для выхода"
              >
                {/* Имя  */}
                <span className={styles.userName}>{fullName}</span>
 
                {/* Аватарка */}
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
            ) : (
              /* Кнопка "Личный кабинет" */
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
    </>
  );
};