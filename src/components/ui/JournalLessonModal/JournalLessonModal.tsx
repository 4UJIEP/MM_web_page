import type { FC } from 'react';
import { useState, useEffect } from 'react';
import styles from './JournalLessonModal.module.css';

// ============================================
// TYPES
//
// JournalLessonDetail — полные данные урока
// для журнала. Приходят отдельным запросом
// GET /api/lessons/:id/journal
//
// Посещаемость и баллы — read-only для
// родителей и учеников, выставляет учитель.
// ============================================

export interface JournalLessonDetail {
    id: string;
    topic: string;
    description: string;
    date: string;         // «7 марта, 2026, 10:00-12:00»
    teacher: string;
    teacherPhone: string; 
    materials: string[];  // названия файлов к занятию
    homework: string;
    homeworkFiles: string[];
    isPresent: boolean;   // выставляет учитель
    score: number | null; // баллы, выставляет учитель
}

interface JournalLessonModalProps {
    lessonId: string | null;
    onClose: () => void;
}

// ============================================
// MOCK FETCH
// TODO: заменить на fetch(`/api/lessons/${id}/journal`)
// ============================================

const MOCK_JOURNAL_DETAILS: Record<string, JournalLessonDetail> = {
    '1': {
        id: '1',
        topic: 'Решение простых задач. Графический диктант.',
        description:
            'Сегодня мы прошли с детьми то-то то-то, чего-то и того-то, ' +
            'Сегодня мы прошли с детьми то-то то-то, чего-то и того-то.',
        date: '7 марта, 2026, 10:00-12:00',
        teacher: 'Гарцева Карина Александровна',
        teacherPhone: '+7 (999)-999-99-99',
        materials: ['Файл-пз-пз-фа.pdf'],
        homework: 'Дома надо дэшку сделать',
        homeworkFiles: ['Файл-пз---фа.pdf'],
        isPresent: true,
        score: 5,
    },
};

// Добавляем остальные 11 карточек как копии первой
for (let i = 2; i <= 12; i++) {
    MOCK_JOURNAL_DETAILS[String(i)] = { ...MOCK_JOURNAL_DETAILS['1'], id: String(i) };
}

async function fetchJournalDetail(id: string): Promise<JournalLessonDetail> {
    await new Promise(r => setTimeout(r, 120));
    const detail = MOCK_JOURNAL_DETAILS[id];
    if (!detail) throw new Error(`Урок ${id} не найден`);
    return detail;
}

// ============================================
// INFO CARD — одна плашка
// w:600 min-h:123 br:16 p:16 bg:#fff gap:8
// ============================================

interface InfoCardProps {
    label: string;
    children: React.ReactNode;
}

const InfoCard: FC<InfoCardProps> = ({ label, children }) => (
    <div className={styles.infoCard}>
        {/* Заголовок — Roboto 500 20px #21242B letter-spacing 3% */}
        <span className={styles.infoLabel}>{label}</span>
        {children}
    </div>
);

// ============================================
// FILE CHIP
// ============================================

const FileChip: FC<{ name: string }> = ({ name }) => (
    <span className={styles.fileChip}>{name}</span>
);

// ============================================
// ATTENDANCE & SCORE CARD — последняя плашка
// w:600 h:112 br:16 bg:#fff
// Read-only — только учитель меняет
// ============================================

interface AttendanceCardProps {
    isPresent: boolean;
    score: number | null;
}

const AttendanceCard: FC<AttendanceCardProps> = ({ isPresent, score }) => (
    <div className={styles.attendanceCard}>

        {/* Посещаемость и баллы — Roboto 500 20px #21242B */}
        <span className={styles.infoLabel}>Посещаемость и баллы</span>

        {/* Строка: блок посещения + блок баллов — w:568 h:38 gap:8 */}
        <div className={styles.attendanceRow}>

            {/* Посещение — w:280 h:38 br:8 border:0.6px #00000033 */}
            <div className={styles.attendanceBox}>
                {/* Галочка — w:24 h:24 br:100px */}
                <div className={`${styles.checkCircle} ${isPresent ? styles.checkCircleOn : ''}`}>
                    {isPresent && (
                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden="true">
                            <path
                                d="M1 4.5L4.5 8L11 1"
                                stroke="#ffffff"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </div>
                {/* Посещение — Inter 500 16px #000 */}
                <span className={styles.attendanceText}>Посещение</span>
            </div>

            {/* Баллы — w:280 h:38 br:8 border:0.6px #00000033 p:8 10 8 8 */}
            <div className={styles.scoreBox}>
                {/* inner — w:76 h:22 gap:8 */}
                <div className={styles.scoreInner}>
                    {/* Число — Inter 700 16px #21B46E */}
                    <span className={styles.scoreNumber}>
                        {score !== null ? score : '—'}
                    </span>
                    {/* «баллов» — Inter 500 16px #000 */}
                    <span className={styles.scoreLabel}>баллов</span>
                </div>
            </div>

        </div>
    </div>
);

// ============================================
// MODAL
// ============================================

export const JournalLessonModal: FC<JournalLessonModalProps> = ({ lessonId, onClose }) => {
    const [detail, setDetail] = useState<JournalLessonDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!lessonId) { setDetail(null); setError(null); return; }
        setIsLoading(true);
        setError(null);
        fetchJournalDetail(lessonId)
            .then(setDetail)
            .catch(() => setError('Не удалось загрузить данные урока'))
            .finally(() => setIsLoading(false));
    }, [lessonId]);

    useEffect(() => {
        if (!lessonId) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [lessonId, onClose]);

    if (!lessonId) return null;

    return (
        // Overlay — bg: #3E404426
        <div
            className={styles.overlay}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-label="Подробности урока"
        >
            {/* Плашка — w:600 h:784 br:16 gap:16 */}
            <div className={styles.modal}>

                {isLoading && <div className={styles.loading}>Загрузка...</div>}
                {error && <div className={styles.error}>{error}</div>}

                {detail && !isLoading && (
                    <>
                        {/* Тема — w:598 h:28 Roboto 500 24px #21242B letter-spacing 3% */}
                        <div className={styles.header}>
                            <h2 className={styles.topic}>{detail.topic}</h2>
                        </div>

                        {/* Тело — w:600 h:740 gap:8 */}
                        <div className={styles.body}>

                            {/* Описание к занятию */}
                            <InfoCard label="Описание к занятию">
                                <div className={styles.descriptionBox}>
                                    {/* Inter 500 16px #000 letter-spacing 3% */}
                                    <p className={styles.descriptionText}>{detail.description}</p>
                                </div>
                            </InfoCard>

                            {/* Дата проведения */}
                            <InfoCard label="Дата проведения">
                                <span className={styles.infoValue}>{detail.date}</span>
                            </InfoCard>

                            {/* ФИО преподавателя */}
                            <InfoCard label="ФИО преподавателя">
                                <span className={styles.infoValue}>{detail.teacher}</span>
                            </InfoCard>


                            {/* Файлы к занятию */}
                            {detail.materials.length > 0 && (
                                <InfoCard label="Файлы к занятию">
                                    <div className={styles.files}>
                                        {detail.materials.map((f, i) => <FileChip key={i} name={f} />)}
                                    </div>
                                </InfoCard>
                            )}

                            {/* Домашнее задание */}
                            {detail.homework && (
                                <InfoCard label="Домашнее задание">
                                    {detail.homeworkFiles.length > 0 && (
                                        <div className={styles.files}>
                                            {detail.homeworkFiles.map((f, i) => <FileChip key={i} name={f} />)}
                                        </div>
                                    )}
                                </InfoCard>
                            )}

                            {/* Посещаемость и баллы — read-only */}
                            <AttendanceCard isPresent={detail.isPresent} score={detail.score} />

                        </div>
                    </>
                )}

            </div>
        </div>
    );
};