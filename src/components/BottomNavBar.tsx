import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export default function BottomNavBar() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'dashboard', label: 'Dasbor' },
    { path: '/assets', icon: 'account_balance', label: 'Aset' },
    { path: '/documents', icon: 'description', label: 'Dokumen' },
    { path: '/contacts', icon: 'contacts', label: 'Kontak' },
  ];

  return (
    <nav 
      aria-label="Navigasi Utama"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl rounded-t-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border-t border-slate-200/20 dark:border-slate-800/20"
    >
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path) && (item.path !== '/' || location.pathname === '/');
        
        return (
          <Link
            key={item.path}
            to={item.path}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Menu ${item.label}`}
            className={clsx(
              "flex flex-col items-center justify-center px-4 py-1.5 transition-transform duration-200 ease-out",
              isActive 
                ? "bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 rounded-xl scale-95" 
                : "text-slate-400 dark:text-slate-500 hover:text-blue-700 dark:hover:text-blue-300"
            )}
          >
            <span 
              className="material-symbols-outlined mb-1" 
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-inter text-[10px] font-medium tracking-wide uppercase mt-1">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
