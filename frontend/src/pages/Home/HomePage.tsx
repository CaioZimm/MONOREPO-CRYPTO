import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { FiMenu, FiActivity, FiUser } from "react-icons/fi";

const HomePage: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === "/home/market") return "Mercado de Criptomoedas";
    if (location.pathname === "/home/favorites") return "Criptomoedas Favoritas";
    if (location.pathname === "/home/history") return "Histórico de Conversões";
    if (location.pathname === "/home/profile") return "Meu Perfil & Segurança";
    return "Conversor Instantâneo";
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-20 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer border border-zinc-700/50"
              aria-label="Abrir menu"
            >
              <FiMenu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {getPageTitle()}
              </h2>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>CoinGecko Live API • Rede Conectada</span>
              </div>
            </div>
          </div>

          {/* Right Header Status / User Chip */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-medium text-zinc-300 shadow-sm">
              <FiActivity className="text-emerald-400 w-4 h-4 shrink-0" />
              <span>Status: <strong className="text-emerald-400 font-semibold">Operacional</strong></span>
            </div>

            <Link
              to="/home/profile"
              className="flex items-center gap-2.5 pl-2 sm:pl-4 border-l border-zinc-800 hover:opacity-80 transition-opacity cursor-pointer group"
              title="Editar meu perfil"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-xs shadow-sm group-hover:border-emerald-400 transition-colors">
                <FiUser className="w-4 h-4" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-zinc-200 leading-none group-hover:text-emerald-400 transition-colors">{user?.name || "Usuário"}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">Editar Perfil →</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-zinc-950 relative">
          {/* Subtle Ambient Glow Effect background */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HomePage;