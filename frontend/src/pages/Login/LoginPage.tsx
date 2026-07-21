import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/Auth/Button/Button";
import Input from "../../components/Auth/Input/Input";
import { FiTrendingUp, FiMail, FiLock, FiAlertCircle } from "react-icons/fi";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { handleLogin, isLoading } = useAuth();

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    setError("");

    try {
      await handleLogin({ email, password });
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-950 text-zinc-100 p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/20">
          <FiTrendingUp className="w-7 h-7 text-zinc-950 font-bold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white leading-none">Crypto</h1>
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mt-1">
            Platform
          </p>
        </div>
      </div>

      {/* Login Portal Card */}
      <div className="glass-panel w-full max-w-md p-8 sm:p-10 rounded-3xl border border-zinc-800/90 shadow-2xl animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Bem-vindo</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Acesse sua conta para gerenciar e converter seus ativos.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2.5">
            <FiAlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submitLogin} className="space-y-5">
          <Input
            label="E-mail"
            type="email"
            placeholder="nome@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<FiMail className="w-4 h-4" />}
            required
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<FiLock className="w-4 h-4" />}
            required
          />

          <div className="pt-2">
            <Button text="Entrar na Plataforma" type="submit" loading={isLoading} />
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center text-sm text-zinc-400">
          Ainda não tem conta?{" "}
          <Link
            to="/register"
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 transition-colors"
          >
            Criar conta grátis
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <p className="mt-8 text-xs text-zinc-600 font-medium">
        © {new Date().getFullYear()} Crypto Architecture • Segurança institucional
      </p>
    </div>
  );
};

export default LoginPage;