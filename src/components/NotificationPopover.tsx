import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

export default function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const { assets } = useStore();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alerts = assets.filter(a => a.status === 'Dalam Proses' && a.checklist.some(c => !c.isCompleted));

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="material-symbols-outlined hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors p-2 rounded-full cursor-pointer relative"
      >
        notifications
        {alerts.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-50 dark:border-slate-900"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-surface-container-lowest shadow-2xl rounded-2xl border border-outline-variant/10 z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-outline-variant/10 bg-surface-container-lowest flex justify-between items-center">
            <h3 className="font-headline font-bold text-sm text-primary">Pemberitahuan</h3>
            {alerts.length > 0 && (
              <span className="bg-red-100 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full">{alerts.length} Peringatan</span>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-outline-variant text-4xl mb-2">done_all</span>
                <span className="font-body text-xs text-on-surface-variant">Belum ada peringatan baru. Seluruh ceklis Anda aman!</span>
              </div>
            ) : (
              alerts.map(asset => {
                const pendingCount = asset.checklist.filter(c => !c.isCompleted).length;
                return (
                  <Link 
                    key={asset.id} 
                    to={`/assets/${asset.id}`}
                    onClick={() => setIsOpen(false)}
                    className="block p-4 border-b border-outline-variant/10 hover:bg-surface-container-lowest hover:brightness-95 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-red-500 text-sm">warning</span>
                      </div>
                      <div>
                        <h4 className="font-headline font-bold text-xs text-primary">{asset.name}</h4>
                        <p className="font-body text-[10px] text-on-surface-variant mt-1 leading-relaxed">
                          Anda memiliki <strong className="text-secondary">{pendingCount} ceklis tindakan legal</strong> yang belum diselesaikan pada aset ini.
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
