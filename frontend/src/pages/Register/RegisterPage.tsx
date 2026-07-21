import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/Auth/Button/Button";
import Input from "../../components/Auth/Input/Input";
import { FiTrendingUp, FiUser, FiMail, FiLock, FiAlertCircle } from "react-icons/fi";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { handleRegister, isLoading } = useAuth();

  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setError("");

    try {
      await handleRegister({ name, email, password, confirmPassword });
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erro ao registrar. Verifique os dados informados.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-950 text-zinc-100 p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

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

      {/* Register Portal Card */}
      <div className="glass-panel w-full max-w-md p-8 sm:p-10 rounded-3xl border border-zinc-800/90 shadow-2xl animate-fade-in relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Criar Conta Gratuita</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Junte-se à plataforma institucional para monitorar criptomoedas.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2.5">
            <FiAlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submitRegister} className="space-y-4">
          <Input
            label="Nome Completo"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<FiUser className="w-4 h-4" />}
            required
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="nome@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<FiMail className="w-4 h-4" />}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<FiLock className="w-4 h-4" />}
              required
            />

            <Input
              label="Confirmar"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<FiLock className="w-4 h-4" />}
              required
            />
          </div>

          <div className="pt-3">
            <Button text="Registrar e Acessar" type="submit" loading={isLoading} />
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center text-sm text-zinc-400">
          Já possui uma conta?{" "}
          <Link
            to="/login"
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 transition-colors"
          >
            Fazer login
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

export default RegisterPage;