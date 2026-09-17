import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080B12] text-[#F1F5F9] selection:bg-[#22D3EE] selection:text-[#061018] theme-transition">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
