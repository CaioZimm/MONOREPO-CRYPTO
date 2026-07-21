import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/Auth/Input/Input";
import Button from "../../components/Auth/Button/Button";
import { FiUser, FiMail, FiLock, FiCheckCircle, FiShield } from "react-icons/fi";

const ProfilePage: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (password && password !== confirmPassword) {
      setErrorMsg("As novas senhas não coincidem.");
      return;
    }

    try {
      await updateProfile({
        name,
        email,
        password: password ? password : undefined,
        confirmPassword: confirmPassword ? confirmPassword : undefined,
      });
      setSuccessMsg("Seus dados foram atualizados com sucesso!");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error || "Não foi possível atualizar o perfil.");
    }
  };

  const getInitials = (userName?: string) => {
    if (!userName) return "U";
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <FiShield className="w-3.5 h-3.5" />
          <span>Segurança & Conta</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Editar Perfil
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto">
          Atualize suas informações pessoais, endereço de e-mail e credenciais de acesso de forma segura.
        </p>
      </div>

      {/* Main Glass Profile Portal */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-2xl relative">
        {/* Decorative corner accent mask */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
        </div>

        {/* Avatar & User Summary Header */}
        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-zinc-800/80 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-mono font-bold text-2xl text-zinc-950 shadow-lg shadow-emerald-500/20 shrink-0">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {user?.name || "Usuário"}
            </h2>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">
              {user?.email || "ativo@nexus.app"}
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              Conta Institucional Ativa
            </span>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2.5 relative z-10 animate-fade-in">
            <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2.5 relative z-10 animate-fade-in">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Nome Completo"
              type="text"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              icon={<FiUser className="w-4 h-4" />}
              required
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="nome@gmail.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              icon={<FiMail className="w-4 h-4" />}
              required
            />
          </div>

          <div className="pt-4 border-t border-zinc-800/60">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Alterar Senha (Opcional)
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Deixe os campos em branco caso deseje manter a sua senha atual intacta.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Nova Senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                icon={<FiLock className="w-4 h-4" />}
              />

              <Input
                label="Confirmar Nova Senha"
                type="password"
                placeholder="Repita a nova senha"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                icon={<FiLock className="w-4 h-4" />}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <div className="w-full sm:w-auto min-w-[200px]">
              <Button text="Salvar Alterações" type="submit" loading={isLoading} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
