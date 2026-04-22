import type { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export const NotFound: FC = () => (
    <section className={styles.section}>
        <div className={styles.container}>
            <p className={styles.code}>404</p>
            <h1 className={styles.title}>Страница не найдена</h1>
            <Link to="/" className={styles.link}>
                Вернуться на главную
            </Link>
        </div>
    </section>
);