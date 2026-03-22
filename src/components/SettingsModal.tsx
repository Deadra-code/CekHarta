import { useRef, useState } from 'react';
import { useStore } from '../store/useStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const { assets, activities, documents, contacts, importState, clearAllData, pin, setPin, showDialog } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newPin, setNewPin] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const state = { assets, activities, documents, contacts };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waris-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Validate the structure of the imported JSON
        if (json.assets && Array.isArray(json.assets)) {
          importState({
            assets: json.assets,
            activities: json.activities || [],
            documents: json.documents || [],
            contacts: json.contacts || []
          });
          showDialog({
            title: 'Import Berhasil',
            message: 'Seluruh data Anda telah berhasil dipulihkan dari file cadangan.',
            type: 'primary',
            confirmLabel: 'Mantap'
          });
          onClose();
        } else {
          showDialog({
            title: 'Import Gagal',
            message: 'Format file backup tidak valid. Pastikan file berisi data aset yang benar.',
            type: 'danger',
            confirmLabel: 'Tutup'
          });
        }
      } catch (err) {
        showDialog({
          title: 'Import Gagal',
          message: 'Gagal membaca file backup. Pastikan file tidak rusak dan berformat JSON.',
          type: 'danger',
          confirmLabel: 'Tutup'
        });
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    showDialog({
      title: 'Reset Aplikasi?',
      message: 'PERINGATAN BERSYARAT! Ini akan menghapus SEMUA data aset, dokumen, dan kontak. Data yang dihapus tidak bisa dikembalikan kecuali Anda punya backup. Lanjutkan?',
      type: 'danger',
      confirmLabel: 'Ya, Lanjutkan',
      cancelLabel: 'Batal',
      onConfirm: () => {
        showDialog({
          title: 'Konfirmasi Reset Pabrik',
          message: 'Apakah Anda yakin 100% benar-benar ingin mereset pabrik? Tindakan ini tidak dapat dibatalkan.',
          type: 'danger',
          confirmLabel: 'Ya, Reset Sekarang',
          cancelLabel: 'Tidak',
          onConfirm: () => {
            clearAllData();
            showDialog({
              title: 'Reset Berhasil',
              message: 'Seluruh data aplikasi telah dikosongkan.',
              type: 'primary',
              confirmLabel: 'Oke'
            });
            onClose();
          }
        });
      }
    });
  };

  const handleSetPin = () => {
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      showDialog({
        title: 'PIN Tidak Valid',
        message: 'PIN harus 4 digit angka.',
        type: 'danger',
        confirmLabel: 'Oke'
      });
      return;
    }
    setPin(newPin);
    setNewPin('');
    setIsChangingPin(false);
    showDialog({
      title: 'PIN Diaktifkan',
      message: 'PIN keamanan berhasil diaktifkan.',
      type: 'primary',
      confirmLabel: 'Oke'
    });
  };

  const handleClearPin = () => {
    showDialog({
      title: 'Nonaktifkan PIN?',
      message: 'Apakah Anda yakin ingin menonaktifkan PIN keamanan? Aplikasi tidak akan lagi meminta PIN saat dibuka.',
      type: 'danger',
      confirmLabel: 'Ya, Nonaktifkan',
      cancelLabel: 'Batal',
      onConfirm: () => {
        setPin(null);
        showDialog({
          title: 'PIN Dinonaktifkan',
          message: 'PIN keamanan telah dinonaktifkan.',
          type: 'primary',
          confirmLabel: 'Oke'
        });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-surface-container-lowest w-full max-w-sm p-6 rounded-2xl shadow-2xl animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline font-bold text-xl text-primary">Pengaturan Data</h2>
          <button onClick={onClose} className="text-on-surface-variant p-2 rounded-full hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <button onClick={handleExport} className="w-full bg-primary-container text-on-primary-container py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-[1.25rem]">download</span>
            <span className="font-body font-semibold text-sm">Buat Pencadangan (.json)</span>
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="w-full bg-surface-container text-primary py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[1.25rem]">upload</span>
            <span className="font-body font-semibold text-sm">Restore dari Backup</span>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />

          <hr className="border-outline-variant/30 my-4" />

          <div className="bg-surface-container p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-[1.25rem]">security</span>
              <span className="font-headline font-bold text-sm">Keamanan Aplikasi</span>
            </div>
            
            {!pin ? (
              <div className="space-y-2">
                <input 
                  type="password" 
                  maxLength={4} 
                  placeholder="Masukkan 4 digit PIN baru" 
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full p-2 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest"
                />
                <button onClick={handleSetPin} className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Aktifkan PIN
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center bg-green-50 p-2 rounded-lg border border-green-100">
                  <span className="text-xs text-green-700 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span> PIN Aktif
                  </span>
                  <button onClick={handleClearPin} className="text-xs text-red-600 font-bold hover:underline">Nonaktifkan</button>
                </div>
                {isChangingPin ? (
                  <div className="space-y-2 mt-2">
                    <input 
                      type="password" 
                      maxLength={4} 
                      placeholder="Masukkan 4 digit PIN baru" 
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full p-2 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest"
                    />
                    <div className="flex gap-2">
                      <button onClick={handleSetPin} className="flex-1 bg-primary text-white py-2 rounded-lg text-xs font-semibold">Simpan</button>
                      <button onClick={() => setIsChangingPin(false)} className="flex-1 bg-surface-container-high text-on-surface-variant py-2 rounded-lg text-xs">Batal</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setIsChangingPin(true)} className="text-xs text-primary font-bold hover:underline self-start">Ubah PIN</button>
                )}
              </div>
            )}
          </div>

          <hr className="border-outline-variant/30 my-4" />

          <button onClick={handleReset} className="w-full bg-red-50 text-red-600 border border-red-200 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
            <span className="material-symbols-outlined text-[1.25rem]">delete_forever</span>
            <span className="font-body font-semibold text-xs">Reset Aplikasi (Hapus Semua)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
