import { useState, type FC } from 'react';
import styles from './TeachersPage.module.css';
import { TeacherCard } from '../../components/ui/TeacherCard';
import { teachersData } from '../../data/teacher';

import searchIcon from '../../assets/icons/Search.png';

// ============================================
// TEACHERS PAGE
// Полная страница со списком преподавателей.
// Поиск по имени и достижениям — фронтовый,
// без запросов к серверу (TODO: API).
// ============================================

export const TeachersPage: FC = () => {
    const [query, setQuery] = useState('');

    const filtered = query.trim()
        ? teachersData.filter((t) => {
            const q = query.toLowerCase();
            const fullName = `${t.lastName} ${t.firstName} ${t.middleName}`.toLowerCase();
            const inAchievements = t.achievements.some((a) =>
                a.toLowerCase().includes(q)
            );
            return fullName.includes(q) || inAchievements;
        })
        : teachersData;

    const handleCoursesClick = (teacherId: string) => {
        // TODO: navigate(`/teachers/${teacherId}`)
        console.log('Курсы преподавателя:', teacherId);
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>

                {/* ── Заголовок ─────────────────────────────── */}
                <h1 className={styles.title}>Наши преподаватели</h1>

                {/* ── Поисковая строка ──────────────────────── */}
                <div className={styles.searchRow}>
                    <div className={styles.searchBox}>
                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder="Поиск"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="Поиск преподавателей"
                        />
                        <img
                            src={searchIcon}
                            alt=""
                            className={styles.searchIcon}
                            aria-hidden="true"
                        />
                    </div>
                </div>

                {/* ── Сетка карточек ────────────────────────── */}
                {filtered.length > 0 ? (
                    <div className={styles.grid}>
                        {filtered.map((teacher) => (
                            <TeacherCard
                                key={teacher.id}
                                {...teacher}
                                onCoursesClick={() => handleCoursesClick(teacher.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className={styles.empty}>
                        Преподаватели по запросу «{query}» не найдены
                    </p>
                )}

            </div>
        </section>
    );
};