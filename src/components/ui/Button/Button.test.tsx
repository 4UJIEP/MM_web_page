import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
    it('отображает текст дочернего элемента', () => {
        render(<Button>Записаться</Button>);
        expect(
            screen.getByRole('button', { name: 'Записаться' })
        ).toBeInTheDocument();
    });

    it('вызывает onClick при нажатии', async () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Войти</Button>);
        await userEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('не реагирует на клик в отключённом состоянии', async () => {
        const handleClick = vi.fn();
        render(<Button disabled onClick={handleClick}>Далее</Button>);
        await userEvent.click(screen.getByRole('button'));
        expect(handleClick).not.toHaveBeenCalled();
    });
});