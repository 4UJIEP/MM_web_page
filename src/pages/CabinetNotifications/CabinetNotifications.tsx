import type { FC } from 'react';
import styles from './CabinetNotifications.module.css';
import { useAuth } from '../../context/AuthContext';

import clockIcon from '../../assets/icons/clock.png';

// ============================================
// TYPES
// ============================================

interface Notification {
    id: string;
    /** «Вася | Математика | 9 класс» */
    label: string;
    text: string;
    /** «27 марта, 2026, 9:45» */
    dateLabel: string;
    /** Дата для определения «прочитано/не прочитано» */
    dateRaw: Date;
}

// ============================================
// MOCK DATA
// TODO: заменить на GET /api/notifications
// ============================================

const MOCK_NOTIFICATIONS_PARENT: Notification[] = [
    {
        id: '1',
        label: 'Вася | Математика | 9 класс',
        text: 'Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления',
        dateLabel: '27 марта, 2026, 9:45',
        dateRaw: new Date(2026, 2, 27, 9, 45),
    },
    {
        id: '2',
        label: 'Катя | Шахматы | 9 класс',
        text: 'Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления',
        dateLabel: '7 марта, 2026, 16:00',
        dateRaw: new Date(2026, 2, 7, 16, 0),
    },
];

const MOCK_NOTIFICATIONS_CHILD: Notification[] = [
    {
        id: '1',
        label: 'Математика | 9 класс',
        text: 'Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления',
        dateLabel: '27 марта, 2026, 9:45',
        dateRaw: new Date(2026, 2, 27, 9, 45),
    },
    {
        id: '2',
        label: 'Шахматы | 9 класс',
        text: 'Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления Текст для уведомления',
        dateLabel: '7 марта, 2026, 16:00',
        dateRaw: new Date(2026, 2, 7, 16, 0),
    },
];

// ============================================
// NOTIFICATION ITEM
// ============================================

interface NotificationItemProps {
    notification: Notification;
    isLast: boolean;
}

const NotificationItem: FC<NotificationItemProps> = ({ notification, isLast }) => (
    <>
        {/* Контейнер уведомления — w:1466 h:145 gap:15 */}
        <div className={styles.notifWrap}>

            {/* Внутренний блок — w:1426 h:130 gap:8 */}
            <div className={styles.notifInner}>

                {/* Заголовок — Roboto 500 20px #333 letter-spacing 3% */}
                {/* w:1426 h:23 */}
                <p className={styles.notifLabel}>{notification.label}</p>

                {/* Тело — w:1426 h:99 gap:16 */}
                <div className={styles.notifBody}>

                    {/* Текст — Inter 400 16px #000 letter-spacing 3% */}
                    {/* w:1426 h:66 */}
                    <p className={styles.notifText}>{notification.text}</p>

                    {/* Дата — w:146 h:17 gap:4 */}
                    <div className={styles.notifDate}>
                        {/* Текст даты — Inter 500 12px #21B46E */}
                        {/* w:130 h:17 */}
                        <span className={styles.notifDateText}>{notification.dateLabel}</span>
                        {/* Иконка часов — w:12 h:12 */}
                        <img
                            src={clockIcon}
                            alt=""
                            className={styles.notifDateIcon}
                        />
                    </div>

                </div>
            </div>
        </div>

        {/* Разделительная линия после каждого уведомления */}
        {/* w:1472 border: 2px solid #3E404433 */}
        <hr className={styles.divider} />
    </>
);

// ============================================
// MAIN PAGE
// ============================================

export const CabinetNotifications: FC = () => {
    const { user } = useAuth();
    const isParent = user?.role === 'parent';

    const notifications = isParent
        ? MOCK_NOTIFICATIONS_PARENT
        : MOCK_NOTIFICATIONS_CHILD;

    return (
        // Секция — w:1600 h:1041 bg:#F5F7FA
        <section className={styles.section}>
            <div className={styles.container}>

                {/* Заголовок — Roboto 500 24px #333 top:60 left:80 */}
                {/* w:163 h:28 */}
                <h1 className={styles.title}>Уведомления</h1>

                {/* Разделитель — top:98 border: 2px solid #3E404433 */}
                <hr className={styles.divider} />

                {/* Список уведомлений */}
                <div className={styles.list}>
                    {notifications.length === 0 ? (
                        <p className={styles.empty}>Уведомлений нет</p>
                    ) : (
                        notifications.map((n, i) => (
                            <NotificationItem
                                key={n.id}
                                notification={n}
                                isLast={i === notifications.length - 1}
                            />
                        ))
                    )}
                </div>

            </div>
        </section>
    );
};