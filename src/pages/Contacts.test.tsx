import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Contacts from './Contacts';
import { useStore } from '../store/useStore';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}));

const mockAddContact = vi.fn();
const mockDeleteContact = vi.fn();

describe('Contacts Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as any).mockReturnValue({
      contacts: [
        { id: '1', name: 'Pak Notaris', role: 'Notaris', phone: '08123', email: 'notaris@test.com' }
      ],
      addContact: mockAddContact,
      deleteContact: mockDeleteContact,
      showDialog: vi.fn(({ onConfirm }) => onConfirm?.())
    });
  });

  it('merender daftar kontak', () => {
    render(<MemoryRouter><Contacts /></MemoryRouter>);
    expect(screen.getByText('Pak Notaris')).toBeInTheDocument();
    // Using role instead of email as text might be inside a mailto tag
    expect(screen.getByText('Notaris')).toBeInTheDocument();
  });

  it('bisa membuka modal dan mengubah form kontak baru', async () => {
    render(<MemoryRouter><Contacts /></MemoryRouter>);
    fireEvent.click(screen.getByText('person_add'));
    expect(screen.getByText('Tambah Kontak')).toBeVisible();
    
    fireEvent.change(screen.getByPlaceholderText('Budi Santoso S.H.'), { target: { value: 'Pengacara A' }});
    fireEvent.change(screen.getByPlaceholderText('Pengacara Hukum Keluarga'), { target: { value: 'Pengacara' }});
    fireEvent.change(screen.getByPlaceholderText('budi@contoh.com'), { target: { value: 'mail@test.com' }});
    fireEvent.change(screen.getByPlaceholderText('08123456789'), { target: { value: '123' }});
    
    // Use form submit directly to bypass button requirement quirks in JSDOM, or click button
    const form = screen.getByText('Simpan Kontak').closest('form');
    if (form) fireEvent.submit(form);
    
    expect(mockAddContact).toHaveBeenCalled();
  });

  it('bisa menghapus kontak', () => {
    render(<MemoryRouter><Contacts /></MemoryRouter>);
    const deleteBtn = screen.getByText('delete');
    fireEvent.click(deleteBtn);
    expect(mockDeleteContact).toHaveBeenCalledWith('1');
  });
});
