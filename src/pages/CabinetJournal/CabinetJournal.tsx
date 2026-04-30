import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import styles from './CabinetJournal.module.css';
import { MonthPicker } from '../../components/ui/MonthPicker';
import { JournalLessonModal } from '../../components/ui/JournalLessonModal';
import { useAuth } from '../../context/AuthContext';

import appIcon from '../../assets/icons/folder.png';
import arrowDownIcon from '../../assets/icons/angle-down-icon.png';
import sortIcon from '../../assets/icons/sorting.png';
import radio from '../../assets/icons/pointIcon.png';
import radioEmpty from '../../assets/icons/pointIconEmpty.png';


// ============================================
// TYPES
// ============================================

type SortOrder = 'asc' | 'desc';

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

// Занятие на текущей неделе (Пн–Вс) → белая карточка
function isThisWeek(date: Date): boolean {
    const now = new Date();
    // Начало текущей недели (понедельник)
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day; // воскресенье = 0
    startOfWeek.setDate(now.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);
    // Конец недели (воскресенье)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return date >= startOfWeek && date <= endOfWeek;
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

const RadioIcon: FC<{ checked: boolean }> = ({ checked }) => (
    <img
        src={checked ? radio : radioEmpty}
        alt=""
        aria-hidden="true"
        style={{ width: 18, height: 18, flexShrink: 0, objectFit: 'contain' }}
    />
);

// ============================================
// COURSE DROPDOWN — выбор курса / ребёнка
// ============================================

interface CourseDropdownProps {
    tabs: CourseTab[];
    activeId: string;
    onSelect: (id: string) => void;
}

const CourseDropdown: FC<CourseDropdownProps> = ({ tabs, activeId, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const activeTab = tabs.find(t => t.id === activeId) ?? tabs[0];

    // закрытие 
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen]);

    return (
        <div className={styles.dropdownWrap} ref={ref}>
            <button
                className={styles.dropdownTrigger}
                onClick={() => setIsOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <img src={appIcon} alt="" className={styles.tabIcon} />
                <span className={styles.dropdownTriggerText}>{activeTab.label}</span>
                <img
                    src={arrowDownIcon}
                    alt=""
                    className={`${styles.dropdownArrow} ${isOpen ? styles.dropdownArrowOpen : ''}`}
                />
            </button>

            {isOpen && (
                <div className={styles.courseMenu} role="listbox" aria-label="Выбор курса">
                    <div className={styles.courseMenuInner}>
                        {tabs.map((tab) => {
                            const isActive = tab.id === activeId;
                            return (
                                <button
                                    key={tab.id}
                                    className={styles.courseMenuItem}
                                    role="option"
                                    aria-selected={isActive}
                                    onClick={() => { onSelect(tab.id); setIsOpen(false); }}
                                >
                                    <RadioIcon checked={isActive} />
                                    <span className={isActive ? styles.courseMenuItemTextActive : styles.courseMenuItemTextInactive}>
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};


// ============================================
// SORT DROPDOWN — По возрастанию / по убыванию
// ============================================

interface SortDropdownProps {
    value: SortOrder;
    onChange: (v: SortOrder) => void;
}

const SortDropdown: FC<SortDropdownProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen]);

    const options: { value: SortOrder; label: string }[] = [
        { value: 'asc', label: 'По возрастанию' },
        { value: 'desc', label: 'По убыванию' },
    ];

    const currentLabel = options.find(o => o.value === value)?.label ?? 'По возрастанию';

    return (
        <div className={styles.sortWrap} ref={ref}>
            {/* Триггер — w:216 h:44 br:16 p:10 18 */}
            <button
                className={styles.sortTrigger}
                onClick={() => setIsOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label="Порядок сортировки"
            >
                <img
                    src={sortIcon}
                    alt=""
                    className={styles.sortIcon}
                />
                <span className={styles.sortTriggerText}>{currentLabel}</span>
                <img
                    src={arrowDownIcon}
                    alt=""
                    className={`${styles.sortArrow} ${isOpen ? styles.sortArrowOpen : ''}`}
                />
            </button>

            {isOpen && (
                <div className={styles.sortMenu} role="listbox" aria-label="Порядок сортировки">
                    <div className={styles.sortMenuInner}>
                        {options.map((opt) => {
                            const isActive = opt.value === value;
                            return (
                                <button
                                    key={opt.value}
                                    className={styles.sortMenuItem}
                                    role="option"
                                    aria-selected={isActive}
                                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                >
                                    <RadioIcon checked={isActive} />
                                    <span className={isActive ? styles.sortMenuItemTextActive : styles.sortMenuItemTextInactive}>
                                        {opt.label}
                                    </span>
                                </button>
                            );
                        })}
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

    const thisWeek = isThisWeek(lesson.dateRaw);
    // Белый — занятия текущей недели; голубой — всё остальное (прошедшие и будущие вне недели)
    const cardClass = thisWeek ? styles.lessonCard : `${styles.lessonCard} ${styles.lessonCardBlue}`;

    return (
        <div
            className={cardClass}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
        >
            <p className={styles.lessonTopic}>{lesson.topic}</p>

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
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const handleMonthPick = (date: Date) => {
        setMonth(date.getMonth());
        setYear(date.getFullYear());
    };

    // TODO: фильтровать по activeTabId и month/year из API
    const lessons = MOCK_LESSONS;

    // Имя преподавателя берём из первого урока текущей выборки
    const teacherName = lessons[0]?.teacher ?? '';

    const MONTHS_RU = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    return (
        <section className={styles.section}>
            <div className={styles.container}>

                {/* ── Заголовок ── */}
                <div className={styles.titleBlock}>
                    <h1 className={styles.title}>Журнал</h1>
                    <hr className={styles.divider} />
                </div>

                {/* ── Строка управления: курс слева + сортировка справа ── */}
                <div className={styles.controlsRow}>
                    {isParent ? (
                        <CourseDropdown tabs={tabs} activeId={activeTabId} onSelect={setActiveTabId} />
                    ) : (
                        <div className={styles.tabs}>
                            {tabs.map((tab) => {
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
                            })}
                        </div>
                    )}

                    <SortDropdown value={sortOrder} onChange={setSortOrder} />
                </div>

                {/* ── Строка месяца: MonthPicker слева, преподаватель справа ── */}
                <div className={styles.calendarRow}>
                    <div className={styles.calendarLeft}>
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

                    {/* Имя преподавателя справа
                        Figma: w:319 h:23 Roboto 500 20px #21242B ls:3% */}
                    {teacherName && (
                        <span className={styles.teacherName}>{teacherName}</span>
                    )}
                </div>

                {/* ── Карточки уроков ── */}
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