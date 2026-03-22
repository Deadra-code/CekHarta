import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NotificationPopover from './NotificationPopover';
import { useStore } from '../store/useStore';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}));

describe('NotificationPopover Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('menampilkan lonceng abu-abu jika tidak ada notifikasi', () => {
    (useStore as any).mockReturnValue({
      assets: [
        { id: '1', name: 'Aset Siap', status: 'Siap', checklist: [] }
      ]
    });
    render(
      <MemoryRouter>
        <NotificationPopover />
      </MemoryRouter>
    );
    // There shouldn't be a bubble with a number
    expect(screen.queryByText('1 Peringatan')).not.toBeInTheDocument();
  });

  it('menampilkan indikator merah dan daftar aset jika ada yang belum tuntas', () => {
    (useStore as any).mockReturnValue({
      assets: [
        { 
          id: '2', name: 'Aset Tertunda', status: 'Dalam Proses', 
          checklist: [{ id: 'c1', title: 'Syarat 1', isCompleted: false }] 
        } // Incomplete checklist triggers a notification
      ]
    });
    render(
      <MemoryRouter>
        <NotificationPopover />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    // There should be a notification count bubble
    expect(screen.getByText('1 Peringatan')).toBeInTheDocument();
  });
});
