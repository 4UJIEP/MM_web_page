import type { FC } from 'react';
import { useState } from 'react';
import styles from './CabinetJournal.module.css';
import { MonthPicker } from '../../components/ui/MonthPicker';

import appIcon from '../../assets/icons/app.png';
import { JournalLessonModal } from '../../components/ui/JournalLessonModal';
import arrowDownIcon from '../../assets/icons/angle-down.png';

// ============================================
// TYPES
// ============================================

interface CourseTab {
    id: string;
    label: string;  // «Математика| 9 класс»
}

interface JournalLesson {
    id: string;
    topic: string;
    teacher: string;
    date: string;       // «7 Марта, 2026 16:00 - 18:00»
    isPresent: boolean;
    materials: string[];   // названия файлов
    homework: string;
}

// ============================================
// MOCK DATA
// TODO: заменить на fetch /api/journal?courseId=...&month=...
// ============================================

const MOCK_TABS: CourseTab[] = [
    { id: '1', label: 'Математика| 9 класс' },
    { id: '2', label: 'Шахматы| 9 класс' },
];

const MOCK_LESSONS: JournalLesson[] = Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1),
    topic: 'Решение простых задач. Графический диктант.',
    teacher: 'Гарцева Карина Александровна',
    date: '7 Марта, 2026 16:00 - 18:00',
    isPresent: true,
    materials: ['Файл-nn-nn.pdf'],
    homework: 'Дома надо дэшку сделать',
}));

// ============================================
// LESSON CARD
// ============================================

interface LessonCardProps {
    lesson: JournalLesson;
    onClick: () => void;
}

const LessonCard: FC<LessonCardProps> = ({ lesson, onClick }) => (
    <div className={styles.lessonCard} onClick={onClick} role="button" tabIndex={0} style={{ cursor: 'pointer' }}>

        {/* Тема */}
        <p className={styles.lessonTopic}>{lesson.topic}</p>

        {/* Учитель */}
        <p className={styles.lessonTeacher}>{lesson.teacher}</p>

        {/* Дата + посещаемость */}
        <div className={styles.lessonMeta}>
            <span className={styles.lessonDate}>{lesson.date}</span>
            <div className={styles.attendance}>
                {/* Чекбокс посещения */}
                <div className={`${styles.checkbox} ${lesson.isPresent ? styles.checkboxChecked : ''}`}>
                    {lesson.isPresent && (
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                            <path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>
                <span className={styles.attendanceLabel}>Посещение</span>
            </div>
        </div>

        {/* Материалы */}
        {lesson.materials.length > 0 && (
            <div className={styles.materials}>
                {lesson.materials.map((file, i) => (
                    <span key={i} className={styles.fileChip}>{file}</span>
                ))}
            </div>
        )}

        {/* Домашнее задание */}
        {lesson.homework && (
            <p className={styles.homework}>{lesson.homework}</p>
        )}

        {/* Файл ДЗ */}
        {lesson.materials.length > 0 && (
            <div className={styles.materials}>
                {lesson.materials.map((file, i) => (
                    <span key={i} className={styles.fileChip}>{file}</span>
                ))}
            </div>
        )}

    </div>
);

// ============================================
// MAIN PAGE
// ============================================

export const CabinetJournal: FC = () => {
    const [activeTabId, setActiveTabId] = useState(MOCK_TABS[0].id);
    const [openLessonId, setOpenLessonId] = useState<string | null>(null);
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const handleMonthPick = (date: Date) => {
        setMonth(date.getMonth());
        setYear(date.getFullYear());
    };

    // TODO: фильтровать MOCK_LESSONS по activeTabId и month/year
    const lessons = MOCK_LESSONS;

    return (
        // Секция — w:1600 h:888 bg:#F5F7FA
        <section className={styles.section}>

            {/* Контейнер — w:1472 top:61 left:64 gap:16 */}
            <div className={styles.container}>

                {/* ── Заголовок + линия ─────────────────── */}
                {/* w:1472 h:37 gap:9 */}
                <div className={styles.titleBlock}>
                    {/* Журнал — Roboto 500 24px #21242B letter-spacing 3% */}
                    <h1 className={styles.title}>Журнал</h1>
                    {/* Линия — border: 2px solid #3E404433 */}
                    <hr className={styles.divider} />
                </div>

                {/* ── Вкладки курсов ────────────────────── */}
                {/* w:1472 h:44 gap:4 */}
                <div className={styles.tabs}>
                    {MOCK_TABS.map((tab) => {
                        const isActive = tab.id === activeTabId;
                        return (
                            <button
                                key={tab.id}
                                className={isActive ? styles.tabActive : styles.tabInactive}
                                onClick={() => setActiveTabId(tab.id)}
                                aria-pressed={isActive}
                            >
                                {/* Иконка 24×24 */}
                                <img
                                    src={appIcon}
                                    alt=""
                                    className={styles.tabIcon}
                                />
                                {/* Текст — Inter 500 16px letter-spacing 3% */}
                                <span className={isActive ? styles.tabTextActive : styles.tabTextInactive}>
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ── Выбор месяца (MonthPicker) ─────────── */}
                {/* w:1463 h:32 justify-content:space-between */}
                <div className={styles.calendarRow}>
                    <MonthPicker
                        month={month}
                        year={year}
                        onChange={handleMonthPick}
                    />

                    {/* Навигация по месяцам */}
                    <div className={styles.monthNav}>
                        <button
                            className={styles.arrowBtn}
                            onClick={() => {
                                const d = new Date(year, month - 1, 1);
                                setMonth(d.getMonth());
                                setYear(d.getFullYear());
                            }}
                            aria-label="Предыдущий месяц"
                        >
                            <img
                                src={arrowDownIcon}
                                alt=""
                                className={`${styles.arrowIcon} ${styles.arrowLeft}`}
                            />
                        </button>
                        <button
                            className={styles.arrowBtn}
                            onClick={() => {
                                const d = new Date(year, month + 1, 1);
                                setMonth(d.getMonth());
                                setYear(d.getFullYear());
                            }}
                            aria-label="Следующий месяц"
                        >
                            <img
                                src={arrowDownIcon}
                                alt=""
                                className={`${styles.arrowIcon} ${styles.arrowRight}`}
                            />
                        </button>
                    </div>
                </div>

                {/* ── Карточки уроков ───────────────────── */}
                {/* w:1472 h:611 gap:16, 4 колонки */}
                <div className={styles.grid}>
                    {lessons.map((lesson) => (
                        <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                            onClick={() => setOpenLessonId(lesson.id)}
                        />
                    ))}
                </div>

            </div>
            <JournalLessonModal
                lessonId={openLessonId}
                onClose={() => setOpenLessonId(null)}
            />

        </section>
    );
};