import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MainLayout from './MainLayout';
import { useStore } from '../store/useStore';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}));

// Mock LockScreen to avoid complexities
vi.mock('../components/LockScreen', () => ({
    default: () => <div data-testid="lock-screen">Lock Screen</div>
}));

describe('MainLayout Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('harusnya merender outlet dan bottom nav', () => {
        (useStore as any).mockReturnValue({
            isLocked: false,
            pin: null,
            dialog: { isOpen: false, title: '', message: '', type: 'primary' }
        });
        render(
            <MemoryRouter>
                <MainLayout />
            </MemoryRouter>
        );
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('harusnya merender LockScreen jika terkunci dan PIN ada', () => {
        (useStore as any).mockReturnValue({ 
            isLocked: true, 
            pin: '1234',
            dialog: { isOpen: false, title: '', message: '', type: 'primary' }
        });
        render(
            <MemoryRouter>
                <MainLayout />
            </MemoryRouter>
        );
        expect(screen.getByTestId('lock-screen')).toBeInTheDocument();
    });

    it('harusnya tidak merender LockScreen jika tidak terkunci', () => {
        (useStore as any).mockReturnValue({ 
            isLocked: false, 
            pin: '1234',
            dialog: { isOpen: false, title: '', message: '', type: 'primary' }
        });
        render(
            <MemoryRouter>
                <MainLayout />
            </MemoryRouter>
        );
        expect(screen.queryByTestId('lock-screen')).not.toBeInTheDocument();
    });
});
