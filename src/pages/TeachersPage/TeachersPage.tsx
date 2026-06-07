import { useState, useEffect, type FC } from 'react';
import styles from './TeachersPage.module.css';
import { TeacherCard } from '../../components/ui/TeacherCard';
import { fetchTeachers } from '../../api/auth';


import searchIcon from '../../assets/icons/Search.png';


interface TeacherFromApi {
    id: string;
    name: string | null;
    surname: string | null;
    patronymic: string | null;
    avatar_url: string | null;
    email: string | null;
    phone: string | null;
}

// ============================================
// TEACHERS PAGE
// Полная страница со списком преподавателей.
// Поиск по имени и достижениям — фронтовый,
// без запросов к серверу (TODO: API).
// ============================================

export const TeachersPage: FC = () => {
    const [query, setQuery] = useState('');
    const [teachers, setTeachers] = useState<TeacherFromApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTeachers()
            .then(setTeachers)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const filtered = query.trim()
        ? teachers.filter((t) => {
            const q = query.toLowerCase();
            const fullName = `${t.surname} ${t.name} ${t.patronymic}`.toLowerCase();
            return fullName.includes(q);
        })
        : teachers;

    const handleCoursesClick = (teacherId: string) => {
        // TODO: navigate(`/teachers/${teacherId}`)
        console.log('Курсы преподавателя:', teacherId);
    };

    if (loading) return <p style={{ padding: 32 }}>Загрузка...</p>;
    if (error) return <p style={{ padding: 32, color: 'red' }}>{error}</p>;

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
                                id={teacher.id}
                                firstName={teacher.name ?? '—'}
                                lastName={teacher.surname ?? '—'}
                                middleName={teacher.patronymic ?? ''}
                                photo={teacher.avatar_url
                                    ? `https://xn----btbeiralcm3b5ag4hub.xn--p1ai${teacher.avatar_url}`
                                    : undefined}
                                achievements={[]}
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