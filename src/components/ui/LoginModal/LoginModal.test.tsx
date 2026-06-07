import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginModal } from './LoginModal';

// Мокаем картинку закрытия, чтобы не падать на импорте PNG
vi.mock('../../../assets/icons/close-icon.png', () => ({ default: 'close-icon.png' }));

describe('LoginModal', () => {
    it('не рендерится при isOpen=false', () => {
        render(<LoginModal isOpen={false} onClose={vi.fn()} />);
        expect(screen.queryByText('Вход')).not.toBeInTheDocument();
    });

    it('рендерится с полями логина и пароля при isOpen=true', () => {
        render(<LoginModal isOpen={true} onClose={vi.fn()} />);
        expect(screen.getByLabelText('Логин')).toBeInTheDocument();
        expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    });

    it('кнопка «Войти» неактивна без согласия на обработку данных', () => {
        render(<LoginModal isOpen={true} onClose={vi.fn()} />);
        expect(screen.getByRole('button', { name: 'Войти' })).toBeDisabled();
    });

    it('вызывает onLogin с корректными данными после заполнения формы', async () => {
        const onLogin = vi.fn();
        render(<LoginModal isOpen={true} onClose={vi.fn()} onLogin={onLogin} />);

        await userEvent.type(screen.getByLabelText('Логин'), 'ivanov');
        await userEvent.type(screen.getByLabelText('Пароль'), 'secret123');
        await userEvent.click(screen.getByLabelText(/согласие|персональных данных/i));
        await userEvent.click(screen.getByRole('button', { name: 'Войти' }));

        expect(onLogin).toHaveBeenCalledWith('ivanov', 'secret123');
    });
});