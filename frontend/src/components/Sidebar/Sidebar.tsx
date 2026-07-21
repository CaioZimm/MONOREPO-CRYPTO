import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  FiRefreshCw,
  FiTrendingUp,
  FiStar,
  FiClock,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || (path !== "/home" && location.pathname.startsWith(path));
  };

  const navItems = [
    { label: "Conversor", path: "/home", icon: <FiRefreshCw className="w-5 h-5" />, exact: true },
    { label: "Mercado ao Vivo", path: "/home/market", icon: <FiTrendingUp className="w-5 h-5" /> },
    { label: "Favoritos", path: "/home/favorites", icon: <FiStar className="w-5 h-5" /> },
    { label: "Histórico", path: "/home/history", icon: <FiClock className="w-5 h-5" /> },
    { label: "Meu Perfil", path: "/home/profile", icon: <FiUser className="w-5 h-5" /> },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-900/95 border-r border-zinc-800/80 backdrop-blur-2xl text-zinc-300 select-none">
      {/* Brand Logo & Collapse Toggle */}
      <div className={`flex items-center ${isCollapsed ? "justify-center px-0" : "justify-between px-5"} h-20 border-b border-zinc-800/80 relative transition-all`}>
        <Link
          to="/home"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <FiTrendingUp className="w-6 h-6 text-zinc-950 font-bold" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white leading-none">
                Crypto
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase mt-0.5">
                Platform
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Button */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="hidden md:flex items-center justify-center absolute -right-3 top-1/2 -translate-y-1/2 z-50 w-6 h-6 rounded-full bg-zinc-800 hover:bg-emerald-500 text-zinc-400 hover:text-zinc-950 transition-all cursor-pointer border border-zinc-700/80 shadow-md"
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? <FiChevronRight className="w-3.5 h-3.5 stroke-[2.5]" /> : <FiChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path, item.exact);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3.5 py-3 rounded-xl transition-all duration-200 group relative font-medium text-sm ${active
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-950/40 font-semibold"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                } ${isCollapsed ? "justify-center px-0" : "px-3.5"}`}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Active Indicator Bar */}
              {active && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r-full shadow-[0_0_12px_#10b981]" />
              )}
              <span className={`${active ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-200"} transition-colors shrink-0`}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/40">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <Link
              to="/home/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 overflow-hidden group cursor-pointer"
              title="Editar Perfil"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-sm text-emerald-300 shrink-0 group-hover:bg-emerald-500/30 transition-colors">
                {getInitials(user?.name)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-zinc-200 truncate leading-snug group-hover:text-emerald-400 transition-colors">
                  {user?.name || "Usuário"}
                </p>
                <p className="text-xs text-zinc-500 truncate">{user?.email || "ativo@nexus.app"}</p>
              </div>
            </Link>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
              title="Sair da conta"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-1">
            <Link
              to="/home/profile"
              onClick={() => setMobileOpen(false)}
              className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-sm text-emerald-300 hover:bg-emerald-500/30 transition-colors cursor-pointer"
              title={`Editar Perfil: ${user?.name || "Usuário"}`}
            >
              {getInitials(user?.name)}
            </Link>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Sair da conta"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block h-screen sticky top-0 shrink-0 transition-all duration-300 ease-in-out z-30 ${isCollapsed ? "w-20" : "w-64"
          }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 z-50 md:hidden transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;