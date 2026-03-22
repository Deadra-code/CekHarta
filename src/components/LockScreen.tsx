import { useState } from 'react';
import { useStore } from '../store/useStore';

export default function LockScreen() {
  const { pin, unlock } = useStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  // If no PIN is set, the app shouldn't be locked by the lock screen logic, 
  // but we handle it just in case.
  if (!pin) {
    return null;
  }

  const handleKeyPress = (num: string) => {
    if (input.length < 4) {
      const newInput = input + num;
      setInput(newInput);
      
      if (newInput.length === 4) {
        if (newInput === pin) {
          unlock();
        } else {
          setError(true);
          setTimeout(() => {
            setInput('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setInput(input.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 transition-colors">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-primary text-3xl">lock</span>
        </div>
        <h2 className="font-headline text-xl font-bold text-slate-800 dark:text-slate-100">Aplikasi Terkunci</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Masukkan 4 digit PIN Anda</p>
      </div>

      <div className="flex gap-4 mb-12">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
              input.length > i 
                ? 'bg-primary border-primary scale-110' 
                : 'border-slate-300 dark:border-slate-700'
            } ${error ? 'bg-error border-error animate-shake' : ''}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-xs w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleKeyPress(num.toString())}
            className="w-16 h-16 rounded-full bg-surface-container-low dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-700 dark:text-slate-200 active:bg-primary active:text-white transition-colors mx-auto"
          >
            {num}
          </button>
        ))}
        <div />
        <button
          onClick={() => handleKeyPress('0')}
          className="w-16 h-16 rounded-full bg-surface-container-low dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-700 dark:text-slate-200 active:bg-primary active:text-white transition-colors mx-auto"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="w-16 h-16 rounded-full flex items-center justify-center text-slate-500 hover:text-primary transition-colors mx-auto"
        >
          <span className="material-symbols-outlined">backspace</span>
        </button>
      </div>

      <p className="mt-12 text-xs text-slate-400">Data Anda tersimpan dengan aman di perangkat ini.</p>
    </div>
  );
}
