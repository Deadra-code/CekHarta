import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import AddAssetModal from '../components/AddAssetModal';
import SettingsModal from '../components/SettingsModal';
import NotificationPopover from '../components/NotificationPopover';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { assets, activities } = useStore();

  /**
   * Mengkalkulasi total valuasi seluruh aset (di-memoize untuk mencegah render ulang berlebih)
   */
  const totalValuation = useMemo(() => {
    return assets.reduce((acc, asset) => acc + asset.valuation, 0);
  }, [assets]);

  const formattedValuation = useMemo(() => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(totalValuation);
  }, [totalValuation]);

  /**
   * Mengelompokkan nominal aset berdasarkan kategorinya
   */
  const allocation = useMemo(() => {
    return assets.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + a.valuation;
      return acc;
    }, {} as Record<string, number>);
  }, [assets]);

  const assetCount = assets.length;

  /**
   * Mengukur persentase rata-rata kelengkapan ceklis legal dari seluruh aset
   */
  const avgProgress = useMemo(() => {
    if (assets.length === 0) return 0;
    return Math.round(assets.reduce((acc, a) => acc + (a.progressPercentage || 0), 0) / assets.length);
  }, [assets]);

  return (
    <>
      <header className="w-full top-0 sticky z-50 bg-slate-50 dark:bg-slate-900 shadow-sm dark:shadow-none flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhfs_zQKgv8BhDgvpV-NrB3XZ7oKx7zuqwPyUp6Opq2VnMqoOK6J__BBS4GEe7WyoLUdFhoAkvsKD-1WMRCARvlwYEXuQocCGEdfX-6pFtGUKMFyyW1P9mMjqIDxZabrePz7-EUqQCTmG1RKtx-lLTmYQFSjuX7wqFn160LPOIVZl1B43sufVLlzyQa2yFrQiE8dtg1dGoqW34y5pQsuk0xxUBjhvIk4eVRyCx5yPf3S0KhF86prWOv1AvDeiOJVI_Ja_H8GUqUwg" alt="Profil Pengguna" />
          </div>
          <span className="font-manrope font-extrabold text-xl text-blue-900 dark:text-blue-100 tracking-tight">Cek Harta</span>
        </div>
        {/* Navigation Actions */}
        <div className="flex items-center text-blue-900 dark:text-blue-200 gap-1">
          <NotificationPopover />
          <button 
            onClick={() => setIsSettingsOpen(true)} 
            aria-label="Pengaturan Aplikasi dan Cadangan Data"
            className="material-symbols-outlined hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors p-2 rounded-full cursor-pointer"
          >
            settings
          </button>
        </div>
      </header>

      <main className="pb-32 px-6 pt-6 max-w-md mx-auto">
        <section className="premium-gradient rounded-xl p-8 text-on-primary shadow-xl mb-8">
          <div className="flex flex-col gap-1">
            <span className="font-label text-xs uppercase tracking-widest opacity-80">Total Estimasi Warisan</span>
            <h1 className="font-headline text-2xl font-extrabold line-clamp-1">{formattedValuation}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-tertiary-fixed-dim text-on-tertiary-fixed-variant px-2 py-0.5 rounded text-[10px] font-bold">+12.4%</span>
              <span className="text-xs opacity-70">Apresiasi Tahunan</span>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-headline text-lg font-bold mb-6 text-primary">Status Evaluasi Aset</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-6 flex flex-col gap-4 shadow-sm rounded-xl">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
              <div>
                <div className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Aset Dikelola</div>
                <div className="font-headline text-xl font-bold text-primary">{assetCount} Total</div>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 flex flex-col gap-4 shadow-sm rounded-xl">
              <span className="material-symbols-outlined text-tertiary" style={{fontVariationSettings: "'FILL' 1"}}>gavel</span>
              <div>
                <div className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Izin Legal</div>
                <div className="font-headline text-xl font-bold text-tertiary">{avgProgress}%</div>
              </div>
            </div>
          </div>
          <div className="mt-6 bg-surface-container-high h-2 w-full rounded-full overflow-hidden">
            <div className="bg-tertiary h-full transition-all duration-1000" style={{width: `${avgProgress}%`}}></div>
          </div>
          <p className="mt-3 font-label text-[10px] text-on-surface-variant">Sebagian aset masih dalam status pending dan butuh verifikasi Pengadilan.</p>
        </section>

        <section className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-headline text-lg font-bold text-primary">Alokasi Aset</h2>
            <Link to="/assets" className="font-label text-xs text-primary font-semibold">Lihat Daftar Lengkap</Link>
          </div>
          <div className="space-y-4">
            {Object.entries(allocation).map(([category, value]) => {
              const formattedV = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0}).format(value);
              return (
                <div key={category} className="bg-surface-container-lowest p-6 flex justify-between items-center shadow-sm rounded-xl">
                  <div className="flex flex-col gap-1">
                    <span className="font-headline text-md font-bold text-primary">{category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-body text-sm font-semibold text-primary">{formattedV}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="font-headline text-lg font-bold mb-6 text-primary">Aktivitas Terbaru</h2>
          <div className="space-y-6">
            {activities.slice(0, 4).map((activity, idx) => {
              const bgColors = ['bg-tertiary', 'bg-primary-container', 'bg-slate-300', 'bg-blue-300'];
              return (
                <div key={activity.id} className="flex gap-4 signature-line pb-4">
                  <div className={`mt-1 w-2 h-2 rounded-full ${bgColors[idx % bgColors.length]} shrink-0`}></div>
                  <div className="flex flex-col gap-1">
                    <span className="font-body text-sm font-medium text-on-surface">{activity.title}</span>
                    <span className="font-label text-[10px] text-on-surface-variant">{activity.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="mt-12 mb-8 text-center pb-8">
          <p className="font-label text-[10px] text-on-surface-variant opacity-50">Cek Harta &bull; Versi 1.1.0</p>
          <p className="font-label text-[9px] text-on-surface-variant opacity-30 mt-1">Dibuat dengan ❤️ untuk Masa Depan</p>
        </footer>
      </main>

      {/* Floating Action Button untuk menambah Aset */}
      <button 
        onClick={() => setIsModalOpen(true)}
        aria-label="Tambah Aset Baru"
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-40 transition-transform active:scale-90"
      >
        <span className="material-symbols-outlined" aria-hidden="true">add</span>
      </button>

      <AddAssetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
