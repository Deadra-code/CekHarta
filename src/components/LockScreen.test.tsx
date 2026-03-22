import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import LockScreen from './LockScreen';
import { useStore } from '../store/useStore';

vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}));

describe('LockScreen Component', () => {
  const mockUnlock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as any).mockReturnValue({
      pin: '1234',
      unlock: mockUnlock
    });
  });

  it('harusnya merender keyboard angka', () => {
    render(<LockScreen />);
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('harusnya memanggil unlock jika PIN benar', () => {
    render(<LockScreen />);
    
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('4'));

    expect(mockUnlock).toHaveBeenCalled();
  });

  it('harusnya tidak memanggil unlock jika PIN salah', () => {
    render(<LockScreen />);
    
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('1'));

    expect(mockUnlock).not.toHaveBeenCalled();
  });
});
