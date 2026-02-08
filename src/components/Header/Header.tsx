import type { FC } from "react";
import { Button } from '../ui/Button/Button';
import styles from './Header.module.css';

import logo from '../../assets/logoMM.png';
import icon from '../../assets/icon.png';

// Типизируем пункты меню
interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string; 
}

// Массив пунктов навигации
const navigationItems: NavItem[] = [
    { id: 'catalog', label: 'КАТАЛОГ КУРСОВ', href: '/courses', icon: icon },
    { id: 'teachers', label: 'ПРЕПОДАВАТЕЛИ', href: '/teachers' },
    { id: 'schedule', label: 'РАСПИСАНИЕ ЗАНЯТИЙ', href: '/schedule' },
    { id: 'news', label: 'НОВОСТИ', href: '/news' },
    { id: 'contacts', label: 'КОНТАКТЫ', href: '/contacts' },
];

export const Header: FC = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
             {/* Левая часть - Логотип */}
                <div className={styles.logo}>
                 {/* Здесь будет твой логотип */}
                    <img 
                        src={logo}
                        alt="Малый Матфак" 
                        className={styles.logoIcon}
                    />
                </div>

                {/* Центральная часть - Навигация */}
                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        {navigationItems.map((item) => (
                        <li key={item.id} className={styles.navItem}>
                            <a href={item.href} className={styles.navLink}>
                                {item.icon && <img src={item.icon} alt="" className={styles.navIcon} />}
                                {item.label}
                            </a>
                        </li>
                        ))}
                    </ul>
                </nav>

                {/* Правая часть - CTA кнопка */}
                <div className={styles.actions}>
                    <Button 
                        variant="primary" 
                        size="lg"
                        onClick={() => console.log('Запись в группу')}
                    >
                        ЗАПИСЬ В ГРУППУ
                    </Button>
                </div>
            </div>
    </header>
  );
};