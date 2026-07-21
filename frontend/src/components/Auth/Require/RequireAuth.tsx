import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isCheckingAuth } = useAuth();
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 text-zinc-400 select-none">
        <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin shadow-lg shadow-emerald-500/10" />
        <span className="text-sm font-medium tracking-wide text-zinc-300">
          Verificando sessão segura...
        </span>
      </div>
    );
  }

  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;