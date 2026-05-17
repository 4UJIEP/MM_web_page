import type { FC } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './TeacherJournal.module.css';
import { TeacherLessonModal } from '../../components/ui/TeacherLessonModal';
import type { TeacherLessonDetail } from '../../components/ui/TeacherLessonModal';
import { CreateLessonModal } from '../../components/ui/CreateLessonModal';

import folderIcon from '../../assets/icons/folder.png';
import personIcon from '../../assets/icons/person.png';
import attachIcon from '../../assets/icons/clock.png'; // TODO: replace with attachment icon
import arrowDownIcon from '../../assets/icons/angle-down-icon.png';
import pointIcon from '../../assets/icons/pointIcon.png';
import pointIconEmpty from '../../assets/icons/pointIconEmpty.png';
import plusIcon from '../../assets/icons/plusIcon.png';

// ============================================
// TYPES
// ============================================

interface CourseGroup {
    id: string;
    label: string;
}

interface Student {
    id: string;
    name: string;
    avatarUrl?: string;
}

interface LessonCol {
    id: string;
    /** Дата «03.03» */
    dateLabel: string;
    dateRaw: Date;
}

/** Посещение + оценка для конкретного ученика на конкретном уроке */
interface AttendanceCell {
    lessonId: string;
    studentId: string;
    isPresent: boolean;
    score: number | null;
}

type Semester = 1 | 2;

interface LessonCard {
    id: string;
    topic: string;
    dateLabel: string;
    presentCount: number;
    totalCount: number;
    materialsCount: number;
    semester: Semester;
    /** Полные данные для модала — хранятся локально, TODO: заменить на API */
    detail?: import('../../components/ui/TeacherLessonModal').TeacherLessonDetail;
}

// ============================================
// MOCK DATA
// TODO: заменить на API
// ============================================

const COURSE_GROUPS: CourseGroup[] = [
    { id: '1', label: 'Шахматы | 6 класс' },
    { id: '2', label: 'Математика | 7 класс' },
    { id: '3', label: 'Математика | 9 класс' },
];

const STUDENTS: Student[] = [
    { id: 's1', name: 'Вася П.М.' },
    { id: 's2', name: 'Вася П.М.' },
    { id: 's3', name: 'Вася П.М.' },
    { id: 's4', name: 'Вася П.М.' },
    { id: 's5', name: 'Вася П.М.' },
];

// 13 колонок с датами
const today = new Date();
const LESSON_COLS: LessonCol[] = Array.from({ length: 13 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (12 - i) * 7);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return { id: `l${i + 1}`, dateLabel: `${day}.${month}`, dateRaw: d };
});

// Начальные данные посещаемости и оценок
const INITIAL_ATTENDANCE: AttendanceCell[] = STUDENTS.flatMap((s, si) =>
    LESSON_COLS.map((l, li) => ({
        lessonId: l.id,
        studentId: s.id,
        isPresent: li === 0, // первый урок — посещён у всех
        score: li === 0 ? (5 - si) : null,
    }))
);

const INITIAL_LESSON_CARDS: LessonCard[] = Array.from({ length: 16 }, (_, i) => ({
    id: `lc${i + 1}`,
    topic: 'Решение простых задач. Графический диктант.',
    dateLabel: '7 Марта, 2026 16:00 - 18:00',
    presentCount: 5,
    totalCount: 6,
    materialsCount: 2,
    semester: (i < 8 ? 1 : 2) as Semester,
}));

// ============================================
// HELPERS
// ============================================

const RadioIcon: FC<{ checked: boolean }> = ({ checked }) => (
    <img
        src={checked ? pointIcon : pointIconEmpty}
        alt=""
        aria-hidden="true"
        style={{ width: 18, height: 18, flexShrink: 0, objectFit: 'contain' }}
    />
);

// ============================================
// COURSE DROPDOWN
// ============================================

interface CourseDropdownProps {
    groups: CourseGroup[];
    activeId: string;
    onSelect: (id: string) => void;
}

const CourseDropdown: FC<CourseDropdownProps> = ({ groups, activeId, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const active = groups.find(g => g.id === activeId) ?? groups[0];

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
            <button
                className={styles.dropdownTrigger}
                onClick={() => setIsOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <img src={folderIcon} alt="" className={styles.dropdownIcon} />
                <span className={styles.dropdownText}>{active.label}</span>
                <img
                    src={arrowDownIcon}
                    alt=""
                    className={`${styles.dropdownArrow} ${isOpen ? styles.dropdownArrowOpen : ''}`}
                />
            </button>

            {isOpen && (
                <div className={styles.dropdownMenu} role="listbox">
                    <div className={styles.dropdownMenuInner}>
                        {groups.map((g) => {
                            const isActive = g.id === activeId;
                            return (
                                <button
                                    key={g.id}
                                    className={styles.dropdownMenuItem}
                                    role="option"
                                    aria-selected={isActive}
                                    onClick={() => { onSelect(g.id); setIsOpen(false); }}
                                >
                                    <RadioIcon checked={isActive} />
                                    <span className={isActive ? styles.dropdownMenuItemActive : styles.dropdownMenuItemInactive}>
                                        {g.label}
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
// TOTAL TOOLTIP — через portal, обходит overflow:hidden таблицы
// ============================================

const TotalTooltipHeader: FC = () => {
    const labelRef = useRef<HTMLSpanElement>(null);
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

    const show = () => {
        if (!labelRef.current) return;
        const r = labelRef.current.getBoundingClientRect();
        setPos({
            // Тултип появляется НАД текстом, выравнивается по правому краю ячейки
            top: r.top + window.scrollY - 82 - 12,
            left: r.right + window.scrollX - 296,
        });
    };

    const hide = () => setPos(null);

    return (
        <div className={styles.totalHeaderWrap} onMouseEnter={show} onMouseLeave={hide}>
            <span ref={labelRef} className={styles.totalHeaderLabel}>Итого</span>

            {pos !== null && createPortal(
                <div
                    className={styles.tooltipPortal}
                    style={{ top: pos.top, left: pos.left }}
                >
                    Левая колонка отвечает за количество посещённых занятий, правая колонка отвечает за количество баллов.
                </div>,
                document.body
            )}
        </div>
    );
};

// ============================================
// ATTENDANCE TABLE
// ============================================

interface AttendanceTableProps {
    students: Student[];
    lessonCols: LessonCol[];
    attendance: AttendanceCell[];
    onTogglePresent: (studentId: string, lessonId: string) => void;
    onScoreChange: (studentId: string, lessonId: string, score: number | null) => void;
}

const AttendanceTable: FC<AttendanceTableProps> = ({
    students,
    lessonCols,
    attendance,
    onTogglePresent,
    onScoreChange,
}) => {
    const getCell = (studentId: string, lessonId: string): AttendanceCell | undefined =>
        attendance.find(a => a.studentId === studentId && a.lessonId === lessonId);

    /** Итого: кол-во посещённых занятий + последняя оценка */
    const getTotal = (studentId: string) => {
        const cells = attendance.filter(a => a.studentId === studentId);
        const presentCount = cells.filter(a => a.isPresent).length;
        const scores = cells.map(a => a.score).filter((s): s is number => s !== null);
        const lastScore = scores.length > 0 ? scores[scores.length - 1] : null;
        return { presentCount, lastScore };
    };

    return (
        <div className={styles.tableContainer}>
            {/* Таблица — горизонтальный скролл если не помещается */}
            <div className={styles.tableScroll}>
                <table className={styles.table}>
                    {/* ── Заголовок ── */}
                    <thead>
                        <tr className={styles.headerRow}>
                            {/* Колонка «Ученик» */}
                            <th className={styles.thStudent}>Ученик</th>

                            {/* Даты занятий */}
                            {lessonCols.map(col => (
                                <th key={col.id} className={styles.thDate}>
                                    {col.dateLabel}
                                </th>
                            ))}

                            {/* Итого — с тултипом через portal (обходим overflow:hidden) */}
                            <th className={styles.thTotal}>
                                <TotalTooltipHeader />
                            </th>
                        </tr>
                    </thead>

                    {/* ── Тело ── */}
                    <tbody>
                        {students.map((student, idx) => {
                            const { presentCount, lastScore } = getTotal(student.id);
                            return (
                                <tr
                                    key={student.id}
                                    className={`${styles.bodyRow} ${idx % 2 === 0 ? styles.bodyRowEven : ''}`}
                                >
                                    {/* Имя ученика */}
                                    <td className={styles.tdStudent}>
                                        <div className={styles.studentCell}>
                                            {student.avatarUrl ? (
                                                <img src={student.avatarUrl} alt="" className={styles.avatar} />
                                            ) : (
                                                <div className={styles.avatarPlaceholder} />
                                            )}
                                            <span className={styles.studentName}>{student.name}</span>
                                        </div>
                                    </td>

                                    {/* Ячейки посещаемости + оценки */}
                                    {lessonCols.map(col => {
                                        const cell = getCell(student.id, col.id);
                                        const isPresent = cell?.isPresent ?? false;
                                        const score = cell?.score ?? null;

                                        return (
                                            <td key={col.id} className={styles.tdCell}>
                                                <div className={styles.cellInner}>
                                                    {/* Чекбокс посещения */}
                                                    <button
                                                        className={styles.checkBtn}
                                                        onClick={() => onTogglePresent(student.id, col.id)}
                                                        aria-label={isPresent ? 'Отметить отсутствие' : 'Отметить присутствие'}
                                                        title={isPresent ? 'Присутствовал' : 'Отсутствовал'}
                                                    >
                                                        <div className={`${styles.checkbox} ${isPresent ? styles.checkboxChecked : ''}`}>
                                                            {isPresent && (
                                                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                                                                    <path d="M1 4l2.8 2.8L9 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </button>

                                                    {/* Оценка — только если посещал */}
                                                    {isPresent ? (
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            max={10}
                                                            value={score ?? ''}
                                                            placeholder="—"
                                                            className={styles.scoreInput}
                                                            onChange={e => {
                                                                const v = e.target.value;
                                                                onScoreChange(student.id, col.id, v === '' ? null : Number(v));
                                                            }}
                                                            aria-label="Оценка"
                                                        />
                                                    ) : (
                                                        <span className={styles.scoreDash}>—</span>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}

                                    {/* Итого */}
                                    <td className={styles.tdTotal}>
                                        <div className={styles.totalCell}>
                                            <span className={styles.totalPresent}>{presentCount}</span>
                                            {lastScore !== null && (
                                                <span className={styles.totalScore}>{lastScore}</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ============================================
// LESSON CARD (нижняя сетка)
// ============================================

interface LessonCardItemProps {
    card: LessonCard;
    onClick: () => void;
}

const LessonCardItem: FC<LessonCardItemProps> = ({ card, onClick }) => (
    <div
        className={styles.lessonCard}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onClick()}
    >
        {/* Тема — w:328 h:44 Inter 500 16px #21242B lh:140% ls:3% */}
        <div className={styles.lessonCardTopicWrap}>
            <p className={styles.lessonCardTopic}>{card.topic}</p>
        </div>

        {/* Дата — w:177 h:17 Inter 500 12px #21242B lh:140% ls:3% */}
        <div className={styles.lessonCardDateWrap}>
            <span className={styles.lessonCardDate}>{card.dateLabel}</span>
        </div>

        {/* Разделитель — w:352 h:0 border:2px #EAF5FF */}
        <div className={styles.lessonCardDivider} />

        {/* Мета: w:328 h:17 space-between */}
        <div className={styles.lessonCardMeta}>
            {/* Слева: иконка человека 16x16 + текст — Inter 500 12px #3E404480 */}
            <span className={styles.lessonCardAttend}>
                <img src={personIcon} alt="" className={styles.lessonCardMetaIcon} />
                {card.presentCount}/{card.totalCount} присутствовали
            </span>

            {/* Справа: иконка 16x16 + число — Inter 500 12px #3E404480 */}
            <span className={styles.lessonCardMaterials}>
                <img src={attachIcon} alt="" className={styles.lessonCardMetaIcon} />
                {card.materialsCount}
            </span>
        </div>
    </div>
);

// ============================================
// MAIN — TeacherJournal
// ============================================

export const TeacherJournal: FC = () => {
    const [activeGroupId, setActiveGroupId] = useState(COURSE_GROUPS[0].id);
    const [attendance, setAttendance] = useState<AttendanceCell[]>(INITIAL_ATTENDANCE);
    const [openLessonId, setOpenLessonId] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [lessonCards, setLessonCards] = useState<LessonCard[]>(INITIAL_LESSON_CARDS);
    const nextCardId = useRef(INITIAL_LESSON_CARDS.length + 1);
    // Хранилище деталей каждой карточки (lessonId -> detail)
    const [detailsMap, setDetailsMap] = useState<Record<string, TeacherLessonDetail>>({});
    // Фильтр по полугодию
    const [activeSemester, setActiveSemester] = useState<Semester>(1);
    // Toast-уведомление
    const [toastVisible, setToastVisible] = useState(false);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Toast-уведомление
    const showToast = useCallback(() => {
        setToastVisible(true);
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000);
    }, []);

    // Обработчик сохранения изменений из TeacherLessonModal
    const handleLessonSave = useCallback((
        lessonId: string,
        data: { students: { id: string; name: string; isPresent: boolean; score: number | null }[]; lessonFiles: { name: string; size: string }[]; homeworkFiles: { name: string; size: string }[]; topic: string; date: string; description: string }
    ) => {
        // Обновляем карточку в сетке
        setLessonCards(prev => prev.map(card =>
            card.id === lessonId
                ? {
                    ...card,
                    topic: data.topic || card.topic,
                    dateLabel: data.date || card.dateLabel,
                    presentCount: data.students.filter(s => s.isPresent).length,
                    materialsCount: data.lessonFiles.length + data.homeworkFiles.length,
                }
                : card
        ));
        // Обновляем детали для следующего открытия
        setDetailsMap(prev => {
            const existing = prev[lessonId];
            return {
                ...prev,
                [lessonId]: {
                    ...(existing ?? { id: lessonId, teacher: '', homework: '' }),
                    topic: data.topic,
                    date: data.date,
                    description: data.description,
                    students: data.students,
                    files: data.lessonFiles,
                    homeworkFiles: data.homeworkFiles,
                } as TeacherLessonDetail,
            };
        });
        showToast();
    }, [showToast]);

    const handleCreateSubmit = useCallback((data: { form: { topic: string; date: string; lessonFiles: unknown[]; homeworkFiles: unknown[] }; students: unknown[] }) => {
        const newCard: LessonCard = {
            id: `lc${nextCardId.current++}`,
            topic: data.form.topic || 'Новое занятие',
            dateLabel: data.form.date || 'Дата не указана',
            presentCount: (data.students as { isPresent: boolean }[]).filter(s => s.isPresent).length,
            totalCount: (data.students as unknown[]).length,
            materialsCount: (data.form.lessonFiles as unknown[]).length + (data.form.homeworkFiles as unknown[]).length,
            semester: activeSemester,
        };
        setLessonCards(prev => [newCard, ...prev]);
    }, []);

    const handleTogglePresent = (studentId: string, lessonId: string) => {
        setAttendance(prev =>
            prev.map(a =>
                a.studentId === studentId && a.lessonId === lessonId
                    ? { ...a, isPresent: !a.isPresent, score: !a.isPresent ? a.score : null }
                    : a
            )
        );
    };

    const handleScoreChange = (studentId: string, lessonId: string, score: number | null) => {
        setAttendance(prev =>
            prev.map(a =>
                a.studentId === studentId && a.lessonId === lessonId
                    ? { ...a, score }
                    : a
            )
        );
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>

                {/* ── Заголовок ── */}
                <div className={styles.titleBlock}>
                    <h1 className={styles.title}>Журнал</h1>
                    <hr className={styles.divider} />
                </div>

                {/* ── Контрол: курс + группа ── */}
                <div className={styles.controlsRow}>
                    <CourseDropdown
                        groups={COURSE_GROUPS}
                        activeId={activeGroupId}
                        onSelect={setActiveGroupId}
                    />
                </div>

                {/* ── Таблица посещаемости ── */}
                <AttendanceTable
                    students={STUDENTS}
                    lessonCols={LESSON_COLS}
                    attendance={attendance}
                    onTogglePresent={handleTogglePresent}
                    onScoreChange={handleScoreChange}
                />

                {/* ── Разделитель — mt:34px border:2px #3E404433 ── */}
                <hr className={styles.sectionDivider} />

                {/* ── Нижний блок: полугодие + занятия ── */}
                <div className={styles.lessonsSection}>
                    {/* Строка управления: табы полугодий + кнопка добавить */}
                    <div className={styles.lessonsSectionHeader}>

                        {/* Переключатель полугодий */}
                        <div className={styles.semesterTabs}>
                            {([1, 2] as Semester[]).map(s => (
                                <button
                                    key={s}
                                    className={`${styles.semesterTab} ${activeSemester === s ? styles.semesterTabActive : ''}`}
                                    onClick={() => setActiveSemester(s)}
                                >
                                    {s} полугодие
                                </button>
                            ))}
                        </div>

                        {/* Кнопка добавить занятие */}
                        <button className={styles.addLessonBtn} onClick={() => setIsCreateOpen(true)}>
                            <img src={plusIcon} alt="" className={styles.addLessonIcon} />
                            <span className={styles.addLessonText}>Добавить занятие</span>
                        </button>
                    </div>

                    {/* Сетка карточек — фильтр по активному полугодию */}
                    {lessonCards.filter(c => c.semester === activeSemester).length > 0 ? (
                        <div className={styles.lessonsGrid}>
                            {lessonCards
                                .filter(c => c.semester === activeSemester)
                                .map(card => (
                                    <LessonCardItem
                                        key={card.id}
                                        card={card}
                                        onClick={() => setOpenLessonId(card.id)}
                                    />
                                ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyStateText}>
                                Занятий в {activeSemester} полугодии пока нет
                            </span>
                        </div>
                    )}
                </div>

            </div>

            {/* ── Toast-уведомление ── */}
            <div className={`${styles.toast} ${toastVisible ? styles.toastVisible : ''}`} role="status" aria-live="polite">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <circle cx="9" cy="9" r="8.5" stroke="#21B46E" strokeWidth="1.2" />
                    <path d="M5 9l3 3 5-5" stroke="#21B46E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Изменения сохранены
            </div>

            {/* ── Модальное окно занятия ── */}
            <CreateLessonModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreateSubmit}
            />
            <TeacherLessonModal
                lessonId={openLessonId}
                onClose={() => setOpenLessonId(null)}
                initialDetail={openLessonId ? (detailsMap[openLessonId] ?? null) : null}
                onSave={handleLessonSave}
            />
        </section>
    );
};