import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';

describe('BottomNavBar Component', () => {
  it('harusnya merender 4 item navigasi utama', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <BottomNavBar />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('Menu Dasbor')).toBeInTheDocument();
    expect(screen.getByLabelText('Menu Aset')).toBeInTheDocument();
    expect(screen.getByLabelText('Menu Dokumen')).toBeInTheDocument();
    expect(screen.getByLabelText('Menu Kontak')).toBeInTheDocument();
  });

  it('harusnya menandai tab aktif yang sesuai dengan letak URL', () => {
    render(
      <MemoryRouter initialEntries={['/assets']}>
        <BottomNavBar />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('Menu Aset')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByLabelText('Menu Dasbor')).not.toHaveAttribute('aria-current', 'page');
  });
});
