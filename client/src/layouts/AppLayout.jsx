import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 theme-transition">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
