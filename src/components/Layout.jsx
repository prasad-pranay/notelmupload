import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import { useAppStore } from '../store/appStore.js';

export default function Layout() {

  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-screen bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden transition-colors duration-300">
      <Sidebar />
      <div className={`flex flex-col flex-1 transition-all duration-300 bg-[#0a0a0c] ${sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-20'}`}>
        <Navbar />
        {/* <main className="flex-1 overflow-y-auto p-0  border-l border-t rounded-tl-xl border-[var(--border-main)]"> */}
        <main className="flex-1 overflow-y-auto p-0  ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
