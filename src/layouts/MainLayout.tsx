import { Outlet } from 'react-router-dom';
import BottomNavBar from '../components/BottomNavBar';
import LockScreen from '../components/LockScreen';
import VibrantModal from '../components/VibrantModal';
import { useStore } from '../store/useStore';

export default function MainLayout() {
  const { isLocked, pin } = useStore();

  return (
    <div className="bg-slate-100 min-h-screen w-full font-body antialiased selection:bg-primary-fixed selection:text-on-primary-fixed flex justify-center">
      {isLocked && pin && <LockScreen />}
      <div className="bg-surface text-on-surface w-full max-w-md min-h-screen shadow-2xl relative flex flex-col isolate">
        <main className="flex-1 pb-16">
          <Outlet />
        </main>
        <BottomNavBar />
        <VibrantModal />
      </div>
    </div>
  );
}
