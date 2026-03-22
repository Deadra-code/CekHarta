import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

vi.mock('./store/useStore', () => ({
  useStore: vi.fn(() => ({
    isLocked: false,
    pin: null,
    assets: [],
    activities: [],
    documents: [],
    contacts: [],
    dialog: { isOpen: false, title: '', message: '', type: 'primary' }
  }))
}));

describe('App Component', () => {
  it('harusnya merender dasbor sebagai rute default', () => {
    render(<App />);
    expect(screen.getByText('Cek Harta')).toBeInTheDocument();
    expect(screen.getByText(/Total Estimasi Warisan/)).toBeInTheDocument();
  });
});
