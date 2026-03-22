import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import AddAssetModal from '../components/AddAssetModal';

export default function Assets() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { assets } = useStore();

  /**
   * Daftar aset difilter berdasarkan kata kunci pencarian,
   * di-memoize agar tidak menghitung ulang pada setiap render 
   * kecuali jika array assets atau searchQuery berubah.
   */
  const filteredAssets = useMemo(() => {
    if (!searchQuery.trim()) return assets;
    const lowerQuery = searchQuery.toLowerCase();
    return assets.filter(a => 
      a.name.toLowerCase().includes(lowerQuery) || 
      a.category.toLowerCase().includes(lowerQuery)
    );
  }, [assets, searchQuery]);

  return (
    <>
      <header className="w-full top-0 sticky z-30 bg-slate-50 shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/20">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu2ePiJbrfeEXJifokbBHyWTW5HEedFOW6yW5R4SFYiD8Gc0DkVPoCyaO8XrIvESCqidwK_H5wqZoyvWv1cgysmb9VwyZb5hYB9HshqNsu2H4b2rK7V2i9IdPTXWJoESNghZX3ClkBb5qitNwk6JUf4Hj8yIHXXOLWBrDRiksRw5arvTjCnJ_A7ACOaeRCeya9gzp1YowW_YHbDGuW4qzI5NycdMTYfIBuQpLYytfyRk-2qpEvGdbVvm3A28JSZOomaRNUFdPUCPQ" alt="User" />
            </div>
            <h1 className="font-manrope font-extrabold text-xl text-blue-900 tracking-tight">Cek Harta</h1>
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="Notifikasi" className="p-2 text-blue-900 hover:bg-slate-100 transition-colors rounded-full">
              <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
            </button>
          </div>
        </div>
        <div className="bg-slate-100 h-[1px] w-full"></div>
      </header>

      <main className="pb-32 px-6 pt-8 max-w-md mx-auto">
        <header className="mb-10">
          <div className="mb-2">
            <span className="font-inter text-[10px] font-medium tracking-wide uppercase text-on-surface-variant">Brankas Aman</span>
          </div>
          <h2 className="font-manrope font-bold text-3xl text-primary leading-tight">Daftar Aset</h2>
          <p className="font-inter text-sm text-on-surface-variant mt-2 max-w-xs">Pusat kontrol dan manajemen peninggalan warisan Anda.</p>
        </header>

        {/* Filter / Search Bar */}
        <div className="relative mb-8">
          <div className="flex items-center gap-3 pb-2 border-b border-outline-variant/20 focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-outline" aria-hidden="true">search</span>
            <input 
              className="w-full bg-transparent border-none focus:ring-0 p-0 font-inter text-base outline-none placeholder:text-outline/50" 
              placeholder="Cari aset berdasarkan nama atau kategori..." 
              type="text" 
              aria-label="Cari Aset"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Dynamic Assets List rendered via Map */}
        <section className="space-y-6">
          {filteredAssets.length === 0 ? (
            <div className="text-center p-8 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/30 mt-6">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-2" aria-hidden="true">search_off</span>
              <p className="font-body text-sm text-on-surface-variant">Tidak ada aset yang sesuai kriteria pencarian.</p>
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const isReady = asset.status === 'Siap';
              const progress = asset.progressPercentage || 0;

            return (
              <Link key={asset.id} to={`/assets/${asset.id}`} className="block bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(24,28,30,0.04)] relative overflow-hidden active:scale-[0.98] transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="font-inter text-xs text-on-surface-variant mb-1">{asset.category}</span>
                    <h3 className="font-manrope font-bold text-xl text-primary">{asset.name}</h3>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${isReady ? 'bg-tertiary-fixed-dim/20' : 'bg-secondary-container/40'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-tertiary' : 'bg-secondary'}`}></div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isReady ? 'text-tertiary' : 'text-on-secondary-container'}`}>
                      {asset.status}
                    </span>
                  </div>
                </div>
                
                <div className="mt-8">
                  {!isReady && (
                    <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                  )}
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <span className="font-inter text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">Valuasi</span>
                      <span className="font-manrope font-bold text-lg text-primary">{asset.valuationLabel}</span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary pointer-events-none">
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </Link>
            );
          })
          )}
        </section>
      </main>

      <button 
        onClick={() => setIsModalOpen(true)}
        aria-label="Tambah Aset Baru"
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-40 transition-transform active:scale-90"
      >
        <span className="material-symbols-outlined" aria-hidden="true">add</span>
      </button>

      <AddAssetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
