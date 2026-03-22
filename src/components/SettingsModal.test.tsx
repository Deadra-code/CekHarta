import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SettingsModal from './SettingsModal';
import { useStore } from '../store/useStore';

// Mock the useStore hook
vi.mock('../store/useStore', () => ({
  useStore: vi.fn(),
}));

describe('SettingsModal Component', () => {
    const mockOnClose = vi.fn();
    const mockImportState = vi.fn();
    const mockClearAllData = vi.fn();
    const mockSetPin = vi.fn();
    const mockShowDialog = vi.fn(({ onConfirm }) => onConfirm?.());

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'alert').mockImplementation(() => {});

        // Default mock for useStore
        (useStore as any).mockReturnValue({
            assets: [],
            activities: [],
            documents: [],
            contacts: [],
            importState: mockImportState,
            clearAllData: mockClearAllData,
            pin: null,
            setPin: mockSetPin,
            showDialog: mockShowDialog
        });
    });

    it('tidak akan merender apa pun jika isOpen false', () => {
        const { container } = render(<SettingsModal isOpen={false} onClose={mockOnClose} />);
        expect(container.firstChild).toBeNull();
    });

    it('bisa mengatur PIN baru', () => {
        render(<SettingsModal isOpen={true} onClose={mockOnClose} />);
        const input = screen.getByPlaceholderText('Masukkan 4 digit PIN baru');
        const button = screen.getByText('Aktifkan PIN');

        fireEvent.change(input, { target: { value: '1234' } });
        fireEvent.click(button);

        expect(mockSetPin).toHaveBeenCalledWith('1234');
    });

    it('menampilkan status PIN aktif jika ada PIN', () => {
        (useStore as any).mockReturnValue({
            assets: [], activities: [], documents: [], contacts: [],
            importState: mockImportState, clearAllData: mockClearAllData,
            pin: '1234',
            setPin: mockSetPin,
            showDialog: mockShowDialog
        });
        render(<SettingsModal isOpen={true} onClose={mockOnClose} />);
        expect(screen.getByText('PIN Aktif')).toBeInTheDocument();
        expect(screen.getByText('Nonaktifkan')).toBeInTheDocument();
    });

    it('bisa menonaktifkan PIN', () => {
        (useStore as any).mockReturnValue({
            assets: [], activities: [], documents: [], contacts: [],
            importState: mockImportState, clearAllData: mockClearAllData,
            pin: '1234',
            setPin: mockSetPin,
            showDialog: mockShowDialog
        });
        render(<SettingsModal isOpen={true} onClose={mockOnClose} />);
        const button = screen.getByText('Nonaktifkan');
        
        fireEvent.click(button);
        expect(mockSetPin).toHaveBeenCalledWith(null);
    });

    it('memanggil onClose saat tombol tutup diklik', () => {
        render(<SettingsModal isOpen={true} onClose={mockOnClose} />);
        const closeBtn = screen.getByText('close');
        fireEvent.click(closeBtn);
        expect(mockOnClose).toHaveBeenCalled();
    });
});
