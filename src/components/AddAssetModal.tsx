import { useState } from 'react';
import { useStore, type Asset } from '../store/useStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAssetModal({ isOpen, onClose }: Props) {
  const addAsset = useStore(state => state.addAsset);
  const addActivity = useStore(state => state.addActivity);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Asset['category']>('Real Estat');
  const [valuation, setValuation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const valNum = parseInt(valuation.replace(/\D/g, ''), 10) || 0;
    const formattedVal = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(valNum);

    const newId = Date.now().toString();

    const newAsset: Asset = {
      id: newId,
      name,
      category,
      status: 'Dalam Proses',
      valuation: valNum,
      valuationLabel: formattedVal,
      checklist: [
        { id: 'c1', title: 'Verifikasi Dokumen Kepemilikan', description: 'Pastikan dokumen fisik berada di tempat yang aman.', isCompleted: false },
        { id: 'c2', title: 'Peninjauan Pajak', description: 'Konsultasi dengan agen pajak terkait tanggungan berjalan.', isCompleted: false },
      ],
      progressPercentage: 0
    };

    addAsset(newAsset);
    
    // Log activity
    addActivity({
      id: `act_${Date.now()}`,
      title: 'Aset Baru Ditambahkan',
      description: `${name} • Baru saja`,
      date: new Date().toISOString(),
      type: 'other'
    });

    // Reset and close
    setName('');
    setValuation('');
    setCategory('Real Estat');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-surface-container-lowest w-full max-w-md p-6 rounded-t-3xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline font-bold text-xl text-primary">Tambah Aset Baru</h2>
          <button onClick={onClose} className="text-on-surface-variant p-2 rounded-full hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-label text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">Nama Aset</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Contoh: Ruko Gading Serpong"
            />
          </div>

          <div>
            <label className="block font-label text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">Kategori</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as Asset['category'])}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none"
            >
              <option value="Real Estat">Real Estat</option>
              <option value="Finansial">Finansial</option>
              <option value="Kendaraan Klasik">Kendaraan Klasik</option>
              <option value="Koleksi Barang">Koleksi Barang</option>
              <option value="Aset Fisik">Aset Fisik Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block font-label text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">Estimasi Valuasi (Rp)</label>
            <input 
              type="text" 
              required
              value={valuation}
              onChange={(e) => {
                // only allow numbers
                const val = e.target.value.replace(/\D/g, '');
                // Format with thousand separator
                const formatted = val ? new Intl.NumberFormat('id-ID').format(parseInt(val, 10)) : '';
                setValuation(formatted);
              }}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Contoh: 1.500.000.000"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-primary text-on-primary font-body font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg active:scale-[0.98]"
            >
              Simpan Aset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
