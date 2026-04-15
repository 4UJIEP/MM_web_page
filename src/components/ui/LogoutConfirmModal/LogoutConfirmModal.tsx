import type { FC } from 'react';
import styles from './LogoutConfirmModal.module.css';
import { useEffect } from 'react';

interface LogoutConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}


export const LogoutConfirmModal: FC<LogoutConfirmModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onCancel();
    };

    return (
        // Overlay — bg: #3E404426
        <div
            className={styles.overlay}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
        >
            {/* Плашка — w:604 h:180 br:16 bg:#fff */}
            <div className={styles.modal}>

                {/* Текст — Roboto 500 24px #000 letter-spacing 3% */}
                {/* w:522 h:28 top:39 left:29 */}
                <p className={styles.question} id="logout-title">
                    Вы уверены что хотите выйти из аккаунта?
                </p>

                {/* Кнопки — w:240 h:44 top:97 left:311 gap:16 */}
                <div className={styles.actions}>

                    {/* Кнопка «Выйти» — w:132 h:44 br:8 bg:#E82346 shadow */}
                    <button
                        className={styles.btnLogout}
                        onClick={onConfirm}
                        autoFocus
                    >
                        {/* inner — w:96 h:24 gap:8 */}
                        <div className={styles.btnInner}>
                            {/* Иконка выхода 24×24 — SVG стрелка */}
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                                className={styles.logoutIcon}
                            >
                                <path
                                    d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                                    stroke="#F5F7FA"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <polyline
                                    points="16 17 21 12 16 7"
                                    stroke="#F5F7FA"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <line
                                    x1="21" y1="12" x2="9" y2="12"
                                    stroke="#F5F7FA"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                            {/* Текст — w:64 h:23 Roboto 500 20px #F5F7FA letter-spacing 3% */}
                            <span className={styles.btnLogoutText}>Выйти</span>
                        </div>
                    </button>

                    {/* Кнопка «Остаться» — w:92 h:23 Roboto 500 20px #E82346 */}
                    <button
                        className={styles.btnStay}
                        onClick={onCancel}
                    >
                        Остаться
                    </button>

                </div>
            </div>
        </div>
    );
};
