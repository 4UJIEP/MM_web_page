import type { FC } from "react";
import styles from './Header.module.css';

import logo from '../../assets/logoMM.png';

// Типизируем пункты меню
interface NavItem {
  id: string;
  label: string;
  href: string;
}

// Массив пунктов навигации
const navigationItems: NavItem[] = [
    { id: 'courses', label: 'Курсы', href: '/courses' },
    { id: 'teachers', label: 'Наши преподаватели', href: '/teachers' },
    { id: 'olympiads', label: 'Олимпиады', href: '/olympiads' },
    { id: 'news', label: 'Новости', href: '/news' },
    { id: 'contacts', label: 'Контакты', href: '/contacts' },
];

export const Header: FC = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.leftSection}>
                    <div className={styles.logo}>
                        <a href="/" className={styles.logoLink}>
                            <img 
                                src={logo}
                                alt="Малый Матфак"
                                className={styles.logoImage}
                            />
                        </a>
                    </div>

                    <nav className={styles.nav}>
                        {navigationItems.map((item) => (
                            <a 
                                key={item.id} 
                                href={item.href} 
                                className={styles.navLink}
                                >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Правая часть*/}
                <div className={styles.rightSection}>
                    <a href="/profile" className={styles.profileLink}>
                       Личный кабинет 
                    </a>
                </div>
            </div>
    </header>
  );
};