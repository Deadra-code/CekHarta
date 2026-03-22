import { Link, useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function AssetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assets, toggleChecklist, deleteAsset, showDialog } = useStore();
  
  const asset = assets.find(a => a.id === id);

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-screen">
        <h2 className="font-headline text-2xl font-bold mb-4">Aset Tidak Ditemukan</h2>
        <Link to="/assets" className="text-primary underline">Kembali ke Daftar Aset</Link>
      </div>
    );
  }

  const completedCount = asset.checklist.filter(c => c.isCompleted).length;
  const totalCount = asset.checklist.length;

  const handleDelete = () => {
    showDialog({
      title: 'Hapus Aset?',
      message: `Apakah Anda yakin ingin menghapus "${asset.name}"? Semua data terkait aset ini akan hilang selamanya.`,
      type: 'danger',
      confirmLabel: 'Ya, Hapus Aset',
      onConfirm: () => {
        deleteAsset(id!);
        navigate('/assets');
      }
    });
  };

  return (
    <>
      <header className="w-full top-0 sticky z-50 bg-slate-50 dark:bg-slate-900 shadow-sm dark:shadow-none">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <div className="flex items-center gap-3">
            <Link to="/assets" className="material-symbols-outlined text-blue-900 dark:text-blue-200">arrow_back</Link>
            <span className="font-manrope font-extrabold text-xl text-blue-900 dark:text-blue-100 tracking-tight">Cek Harta</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleDelete} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors" title="Hapus Aset">
              <span className="material-symbols-outlined">delete</span>
            </button>
            <span className="material-symbols-outlined text-blue-900 dark:text-blue-200">notifications</span>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSaRISPuHHG0rbDjIZrIbyMFwZqKcQWqSrLtqZ-knXtdPWQVXyp8XEh2haMA5QQi6nCzWVqdjGf9C4KrNINV2Bs_uu-BvpAP4yeeJIYy3xz3L_yJTnxsdrbZxEfjAEX96q4M0geSQ_5vjPNvHaimPojEXBNgefwBFr-BICIgRAJTfXLgM5BK13d-Y8V3GGn4hwZIUJoIiepHN8QV56lbn_57PjaL2e0uHk4DrnfHBflu312-Zmhfe0MEJA60sncmA79p4wzW5Bp-k" alt="Pengguna" />
            </div>
          </div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 h-[1px] w-full"></div>
      </header>

      <main className="pb-32 max-w-md mx-auto">
        <section className="relative h-[353px] w-full overflow-hidden bg-slate-200">
          {/* Using a placeholder gradient or dummy image if specific to Rumah Menteng. Here we can just use the original hero for demo */}
          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXgngDHnnsynUoQjHNlBnt3JYVuYvonGZmR9cA1GRNFnT_7QGbEGFHzyhbyKG6w_CxuHccSjBh1ruOUoME8EuZ1cfpsMU7jhTxWuGnOFXWfNcjz78GkwcgCAJWpFiD6s8jFaNPKSr1tX0MRrVcMDslRxMIb2x-BBT_VNhdHQwR6CsbkraIp_Kcm1RHCG3-aP5nj8d9-qzjLkhDo4kX1y_RCNB5ge_Or1moNDZjeMcZ7uii9sN_ZEJ4FcGWxL1Pu--vKEvCg-qfQ1g" alt="Gambar Aset" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 px-6 pt-6 pb-14 w-full">
            <span className="font-label text-xs uppercase tracking-widest text-on-primary-container bg-primary-container px-2 py-1 rounded-sm mb-2 inline-block">
              {asset.category}
            </span>
            <h1 className="font-headline font-bold text-3xl text-white">{asset.name}</h1>
            <p className="text-white/80 font-body text-sm">{asset.category === 'Real Estat' ? 'Lokasi Aset Tercatat' : 'Data Portofolio'}</p>
          </div>
        </section>

        <div className="px-6 -mt-8 relative z-10">
          <div className="bg-surface-container-lowest p-8 shadow-sm rounded-xl">
            <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1">Estimasi Valuasi Saat Ini</p>
            <div className="flex justify-between items-baseline">
              <h2 className="font-headline font-bold text-2xl text-primary">{asset.valuationLabel}</h2>
            </div>
          </div>
        </div>

        {asset.safeLocation && (
          <section className="mt-8 px-6">
            <h3 className="font-headline font-bold text-lg mb-4 text-primary">Brankas Dokumen Fisik</h3>
            <div className="bg-secondary-container/30 p-6 rounded-xl flex items-start gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm shrink-0">
                <span className="material-symbols-outlined text-primary">lock</span>
              </div>
              <div>
                <h4 className="font-body font-bold text-primary mb-1">Lokasi Penyimpanan</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {asset.safeLocation}
                </p>
              </div>
            </div>
          </section>
        )}

        {totalCount > 0 && (
          <section className="mt-10 px-6">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="font-headline font-bold text-xl text-primary">Panduan Manajemen</h3>
                <p className="text-sm text-on-surface-variant">Protokol Pemindahtanganan Aset</p>
              </div>
              <span className="text-xs font-bold text-tertiary">{completedCount} / {totalCount} Selesai</span>
            </div>

            <div className="space-y-4">
              {asset.checklist.map((item, idx) => (
                <div key={item.id} className="flex gap-4 cursor-pointer" onClick={() => toggleChecklist(asset.id, item.id)}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${item.isCompleted ? 'bg-tertiary' : 'border-2 border-primary bg-surface-container-lowest'}`}>
                      {item.isCompleted ? (
                        <span className="material-symbols-outlined text-white text-sm" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
                      ) : (
                        <span className="text-[10px] font-bold text-primary">{idx + 1}</span>
                      )}
                    </div>
                    {idx < totalCount - 1 && (
                      <div className={`w-[2px] h-full mt-2 ${item.isCompleted ? 'bg-tertiary/20' : 'bg-surface-container-high'}`}></div>
                    )}
                  </div>
                  <div className="pb-6 flex-1 hover:bg-slate-50 p-2 -mt-2 rounded-lg transition-colors">
                    <h4 className={`font-body font-semibold ${item.isCompleted ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {item.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-1">{item.description}</p>
                    {!item.isCompleted && item.title.includes('Notaris') && (
                      <Link to="/contacts" className="inline-block mt-3 bg-primary text-white text-xs font-bold px-4 py-2 rounded-md" onClick={(e) => e.stopPropagation()}>
                        Lihat Detail Kontak
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </>
  );
}
