import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import styles from './CabinetJournal.module.css';
import { MonthPicker } from '../../components/ui/MonthPicker';
import { JournalLessonModal } from '../../components/ui/JournalLessonModal';
import { useAuth } from '../../context/AuthContext';

import appIcon from '../../assets/icons/folder.png';
import arrowDownIcon from '../../assets/icons/angle-down.png';

// ============================================
// TYPES
// ============================================

interface CourseTab {
    id: string;
    /** Для ребёнка: «Математика| 9 класс»
        Для родителя: «Вася | Математика| 9 класс» */
    label: string;
    /** Только отображение в дропдауне (без имени ребёнка) */
    courseLabel: string;
    isActive?: boolean;
}

interface JournalLesson {
    id: string;
    topic: string;
    teacher: string;
    /** ISO-строка или «7 Марта, 2026» для сравнения */
    dateRaw: Date;
    dateLabel: string;
    isPresent: boolean;
    materials: string[];
    homework: string;
}

// ============================================
// HELPERS
// ============================================

function isPast(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

// ============================================
// MOCK DATA
// TODO: заменить на fetch /api/journal?tabId=...&month=...
// ============================================

const CHILD_TABS: CourseTab[] = [
    { id: '1', label: 'Математика| 9 класс', courseLabel: 'Математика | 9 класс' },
    { id: '2', label: 'Шахматы| 9 класс', courseLabel: 'Шахматы | 9 класс' },
];

const PARENT_TABS: CourseTab[] = [
    { id: '1', label: 'Вася | Математика| 9 класс', courseLabel: 'Математика | 9 класс' },
    { id: '2', label: 'Вася | Шахматы| 9 класс', courseLabel: 'Шахматы | 9 класс' },
];

// Генерируем уроки: первые 6 — прошедшие, остальные — будущие
const today = new Date();
const MOCK_LESSONS: JournalLesson[] = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (11 - i) * 7); // каждые 7 дней
    return {
        id: String(i + 1),
        topic: 'Решение простых задач. Графический диктант.',
        teacher: 'Гарцева Карина Александровна',
        dateRaw: d,
        dateLabel: `${d.getDate()} ${['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'][d.getMonth()]} ${d.getFullYear()}, 16:00 - 18:00`,
        isPresent: true,
        materials: ['Файл-nn-nn.pdf'],
        homework: 'Дома надо дэшку сделать',
    };
});

// ============================================
// PARENT DROPDOWN — заменяет вкладки для родителя
// ============================================

interface ParentDropdownProps {
    tabs: CourseTab[];
    activeId: string;
    onSelect: (id: string) => void;
}

const ParentDropdown: FC<ParentDropdownProps> = ({ tabs, activeId, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const activeTab = tabs.find(t => t.id === activeId) ?? tabs[0];

    // Закрытие по клику вне
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen]);

    return (
        <div className={styles.dropdownWrap} ref={ref}>
            {/* Активная вкладка-кнопка — w:316 h:44 br:16 bg:#9492922B */}
            <button
                className={styles.dropdownTrigger}
                onClick={() => setIsOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <img src={appIcon} alt="" className={styles.tabIcon} />
                {/* Текст — Inter 500 16px #21242B */}
                <span className={styles.dropdownTriggerText}>{activeTab.label}</span>
                <img
                    src={arrowDownIcon}
                    alt=""
                    className={`${styles.dropdownArrow} ${isOpen ? styles.dropdownArrowOpen : ''}`}
                />
            </button>

            {/* Плашка выбора — w:258 h:89 br:8 bg:#fff shadow */}
            {isOpen && (
                <div className={styles.dropdownMenu} role="listbox">
                    <div className={styles.dropdownList}>
                        {tabs.map((tab, i) => (
                            <button
                                key={tab.id}
                                className={styles.dropdownItem}
                                role="option"
                                aria-selected={tab.id === activeId}
                                onClick={() => { onSelect(tab.id); setIsOpen(false); }}
                            >
                                {/* Первый элемент — активный цвет #21242B, остальные — #3E4044CC */}
                                <span className={i === 0 && tab.id === activeId
                                    ? styles.dropdownItemTextActive
                                    : styles.dropdownItemTextInactive
                                }>
                                    {tab.courseLabel}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================
// LESSON CARD
// ============================================

interface LessonCardProps {
    lesson: JournalLesson;
    onClick: () => void;
}

const LessonCard: FC<LessonCardProps> = ({ lesson, onClick }) => {
    const past = isPast(lesson.dateRaw);

    return (
        <div
            className={`${styles.lessonCard} ${past ? styles.lessonCardPast : ''}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
        >
            <p className={styles.lessonTopic}>{lesson.topic}</p>
            <p className={styles.lessonTeacher}>{lesson.teacher}</p>

            <div className={styles.lessonMeta}>
                <span className={styles.lessonDate}>{lesson.dateLabel}</span>
                <div className={styles.attendance}>
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

            {lesson.materials.length > 0 && (
                <div className={styles.materials}>
                    {lesson.materials.map((f, i) => <span key={i} className={styles.fileChip}>{f}</span>)}
                </div>
            )}

            {lesson.homework && <p className={styles.homework}>{lesson.homework}</p>}

            {lesson.materials.length > 0 && (
                <div className={styles.materials}>
                    {lesson.materials.map((f, i) => <span key={i} className={styles.fileChip}>{f}</span>)}
                </div>
            )}
        </div>
    );
};

// ============================================
// MAIN PAGE
// ============================================

export const CabinetJournal: FC = () => {
    const { user } = useAuth();
    const isParent = user?.role === 'parent';

    const tabs = isParent ? PARENT_TABS : CHILD_TABS;

    const [activeTabId, setActiveTabId] = useState(tabs[0].id);
    const [openLessonId, setOpenLessonId] = useState<string | null>(null);
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const handleMonthPick = (date: Date) => {
        setMonth(date.getMonth());
        setYear(date.getFullYear());
    };

    // TODO: фильтровать по activeTabId и month/year из API
    const lessons = MOCK_LESSONS;

    return (
        <section className={styles.section}>
            <div className={styles.container}>

                {/* ── Заголовок + линия ─────────────── */}
                <div className={styles.titleBlock}>
                    <h1 className={styles.title}>Журнал</h1>
                    <hr className={styles.divider} />
                </div>

                {/* ── Вкладки / дропдаун ────────────── */}
                <div className={styles.tabs}>
                    {isParent ? (
                        /* Родитель — дропдаун с «Вася | Курс» */
                        <ParentDropdown
                            tabs={tabs}
                            activeId={activeTabId}
                            onSelect={setActiveTabId}
                        />
                    ) : (
                        /* Ребёнок — обычные вкладки */
                        tabs.map((tab) => {
                            const isActive = tab.id === activeTabId;
                            return (
                                <button
                                    key={tab.id}
                                    className={isActive ? styles.tabActive : styles.tabInactive}
                                    onClick={() => setActiveTabId(tab.id)}
                                    aria-pressed={isActive}
                                >
                                    <img src={appIcon} alt="" className={styles.tabIcon} />
                                    <span className={isActive ? styles.tabTextActive : styles.tabTextInactive}>
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* ── Выбор месяца ──────────────────── */}
                <div className={styles.calendarRow}>
                    <MonthPicker
                        month={month}
                        year={year}
                        selectedDate={new Date(year, month, 1)}
                        onChange={handleMonthPick}
                    />
                    <div className={styles.monthNav}>
                        <button
                            className={styles.arrowBtn}
                            onClick={() => { const d = new Date(year, month - 1, 1); setMonth(d.getMonth()); setYear(d.getFullYear()); }}
                            aria-label="Предыдущий месяц"
                        >
                            <img src={arrowDownIcon} alt="" className={`${styles.arrowIcon} ${styles.arrowLeft}`} />
                        </button>
                        <button
                            className={styles.arrowBtn}
                            onClick={() => { const d = new Date(year, month + 1, 1); setMonth(d.getMonth()); setYear(d.getFullYear()); }}
                            aria-label="Следующий месяц"
                        >
                            <img src={arrowDownIcon} alt="" className={`${styles.arrowIcon} ${styles.arrowRight}`} />
                        </button>
                    </div>
                </div>

                {/* ── Карточки уроков ───────────────── */}
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