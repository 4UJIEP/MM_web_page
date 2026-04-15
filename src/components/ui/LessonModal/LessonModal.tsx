import type { FC } from "react";
import styles from './LessonModal.module.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface LessonDetail {
    id: string;
    courseName: string;
    classLabel: string;
    /** «7 марта, 2026» */
    date: string;
    /** «10:00–12:00» */
    timeRange: string;
    teacher: string;
    teacherPhone: string;
    location: string;
}

interface LessonModalProps {
    lessonId: string | null;
    onClose: () => void;
}

// ============================================
// MOCK FETCH
// TODO: заменить на реальный API-запрос:
//   const res = await fetch(`/api/lessons/${lessonId}`)
//   return res.json()
// ============================================

const MOCK_DETAILS: Record<string, LessonDetail> = {
    '1': {
        id: '1',
        courseName: 'Математика',
        classLabel: '9 класс',
        date: '13 марта, 2026',
        timeRange: '10:00–12:00',
        teacher: 'Гарцева Карина Александровна',
        teacherPhone: '+7 (999)-899-99-99',
        location: 'Главный корпус, ул. Фрунзе, 6, ауд. 205',
    },
    '2': {
        id: '2',
        courseName: 'Шахматы',
        classLabel: '9 класс',
        date: '13 марта, 2026',
        timeRange: '13:00–15:00',
        teacher: 'Фаткудинов Владислав Константинович',
        teacherPhone: '+7 (999)-899-99-99',
        location: 'Главный корпус, ул. Фрунзе, 6, ауд. 205',
    },
};

async function fetchLessonDetail(id: string): Promise<LessonDetail> {
    // TODO: заменить на fetch('/api/lessons/' + id)
    await new Promise(r => setTimeout(r, 100)); // имитация задержки сети
    const detail = MOCK_DETAILS[id];
    if (!detail) throw new Error(`Урок ${id} не найден`);
    return detail;
}

// ============================================
// INFO CARD — одна плашка
// ============================================

interface InfoCardProps {
    label: string;
    value: string;
    withIcon?: boolean;
}

const InfoCard: FC<InfoCardProps> = ({ label, value, withIcon }) => (
    <div className={styles.infoCard}>
        {/* Заголовок  */}
        <span className={styles.infoLabel}>{label}</span>
        {/* Значение — */}
        <span className={styles.infoValue}>
            {withIcon && (
                <img
                    src="/src/assets/icons/location.png"
                    alt=""
                    className={styles.locationIcon}
                />
            )}
            {value}
        </span>
    </div>
);

// ============================================
// MODAL
// ============================================

export const LessonModal: FC<LessonModalProps> = ({ lessonId, onClose }) => {
    const navigate = useNavigate();
    const [detail, setDetail] = useState<LessonDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Загружаем детали при открытии
    useEffect(() => {
        if (!lessonId) {
            setDetail(null);
            setError(null);
            return;
        }
        setIsLoading(true);
        setError(null);
        fetchLessonDetail(lessonId)
            .then(setDetail)
            .catch(() => setError('Не удалось загрузить данные урока'))
            .finally(() => setIsLoading(false));
    }, [lessonId]);

    // Закрытие по Escape
    useEffect(() => {
        if (!lessonId) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [lessonId, onClose]);

    if (!lessonId) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        // Overlay 
        <div
            className={styles.overlay}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-label="Подробная информация об уроке"
        >
            {/* Плашка  */}
            <div className={styles.modal}>

                {isLoading && (
                    <div className={styles.loading}>Загрузка...</div>
                )}

                {error && (
                    <div className={styles.error}>{error}</div>
                )}

                {detail && !isLoading && (
                    <>
                        {/* Заголовок */}
                        <div className={styles.header}>
                            <h2 className={styles.title}>
                                {detail.courseName} | {detail.classLabel}
                            </h2>
                        </div>

                        {/* Тело — 4 плашки + кнопка*/}
                        <div className={styles.body}>

                            <InfoCard
                                label="Дата проведения"
                                value={`${detail.date}, ${detail.timeRange}`}
                            />
                            <InfoCard
                                label="ФИО преподавателя"
                                value={detail.teacher}
                            />
                            <InfoCard
                                label="Номер телефона преподавателя"
                                value={detail.teacherPhone}
                            />
                            <InfoCard
                                label="Место проведения"
                                value={detail.location}
                                withIcon
                            />

                            {/* Кнопка —  */}
                            <button
                                className={styles.journalButton}
                                onClick={() => { onClose(); navigate('/cabinet/journal?lesson=' + detail.id); }}
                            >
                                Перейти в журнал
                            </button>

                        </div>
                    </>
                )}

            </div>
        </div>
    );
};
