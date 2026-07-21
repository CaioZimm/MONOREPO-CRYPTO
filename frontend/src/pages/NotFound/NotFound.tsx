import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FiAlertTriangle, FiArrowLeft, FiHome } from "react-icons/fi";

const NotFound: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-950 text-zinc-100 p-4 relative overflow-hidden font-sans">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="glass-panel max-w-md w-full p-8 sm:p-10 rounded-3xl border border-zinc-800 text-center shadow-2xl animate-fade-in space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto shadow-inner">
          <FiAlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-mono text-white tracking-tight">404</h1>
          <h2 className="text-lg font-bold text-zinc-200">Página Não Encontrada</h2>
          <p className="text-sm text-zinc-400">
            O endereço <span className="font-mono text-red-300 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">{location.pathname}</span> não corresponde a nenhum módulo no Crypto Platform.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to="/home"
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
          >
            <FiHome className="w-4 h-4" />
            <span>Ir para o Dashboard</span>
          </Link>

          <Link
            to="/login"
            className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold text-sm flex items-center justify-center gap-2 border border-zinc-700 transition-all"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Página de Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;