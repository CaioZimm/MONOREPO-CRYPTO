import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/Auth/Require/RequireAuth";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

// Pages
import Login from "./pages/Login/LoginPage";
import Register from "./pages/Register/RegisterPage";
import Home from "./pages/Home/HomePage";
import Convert from "./pages/Home/Convert";
import MarketPage from "./pages/Home/MarketPage";
import Favorite from "./pages/Home/FavoritePage";
import History from "./pages/Home/HistoryPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import NotFound from "./pages/NotFound/NotFound";

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isCheckingAuth } = useAuthContext();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 text-zinc-400 select-none font-sans">
        <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin shadow-lg shadow-emerald-500/10" />
        <span className="text-sm font-medium tracking-wide text-zinc-300">
          Verificando sessão...
        </span>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root & Auth Routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />} />

      {/* Protected Home / Dashboard Routes */}
      <Route
        path="/home"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      >
        <Route index element={<Convert />} />
        <Route path="market" element={<MarketPage />} />
        <Route path="favorites" element={<Favorite />} />
        <Route path="history" element={<History />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
