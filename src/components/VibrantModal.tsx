import React from 'react';
import { useStore } from '../store/useStore';

const VibrantModal: React.FC = () => {
  const { dialog, hideDialog } = useStore();

  if (!dialog.isOpen) return null;

  const isDanger = dialog.type === 'danger';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with extreme glassmorphism */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={hideDialog}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-slate-800 animate-in zoom-in-95 fade-in duration-300 ease-out">
        
        {/* Decorative Top Accent */}
        <div className={`h-2 w-full ${isDanger ? 'bg-red-500' : 'bg-primary'}`} />

        <div className="p-8">
          <div className={`w-16 h-16 rounded-2xl ${isDanger ? 'bg-red-50/80 text-red-500' : 'bg-primary/10 text-primary'} flex items-center justify-center mb-6 mx-auto shadow-inner`}>
            <span className="material-symbols-outlined text-3xl">
              {isDanger ? 'warning' : 'info'}
            </span>
          </div>

          <h3 className="font-headline font-bold text-2xl text-slate-900 dark:text-white text-center mb-3">
            {dialog.title}
          </h3>
          
          <p className="font-body text-slate-600 dark:text-slate-400 text-center leading-relaxed">
            {dialog.message}
          </p>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={hideDialog}
            className="flex-1 font-body font-bold text-slate-500 dark:text-slate-400 py-3.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            {dialog.cancelLabel || 'Batal'}
          </button>
          
          <button
            onClick={() => {
              if (dialog.onConfirm) dialog.onConfirm();
              hideDialog();
            }}
            className={`flex-1 font-body font-bold text-white py-3.5 rounded-2xl ${
              isDanger 
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25' 
                : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25'
            } transition-all active:scale-95`}
          >
            {dialog.confirmLabel || 'Lanjutkan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VibrantModal;
