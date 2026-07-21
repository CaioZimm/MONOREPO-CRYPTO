import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../config/AxiosConfig";
import type { User } from "../types";
import { useToast } from "./ToastContext";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  updateProfile: (data: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const verifySession = async () => {
      setIsCheckingAuth(true);
      try {
        const res = await api.get("/auth/me");
        if (res.data?.data?.user) {
          setUser(res.data.data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    verifySession();
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const newToken = res.data.data.token || null;
      const newUser = res.data.data.user;

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken(newToken);
      setUser(newUser);
      showToast("Logado com sucesso! Bem-vindo ao Crypto Platform.", "success");
      navigate("/home");
    } catch (error: any) {
      const errMsg = error?.response?.data?.error || "Credenciais inválidas.";
      showToast(errMsg, "error");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({
    name,
    email,
    password,
    confirmPassword,
  }: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });
      const newToken = res.data.data.token || null;
      const newUser = res.data.data.user;

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken(newToken);
      setUser(newUser);
      showToast("Conta criada com sucesso! Bem-vindo.", "success");
      navigate("/home");
    } catch (error: any) {
      const errMsg = error?.response?.data?.error || "Erro ao registrar conta.";
      showToast(errMsg, "error");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.put("/auth/profile", data);
      const updatedUser = res.data.data.user;
      setUser(updatedUser);
      showToast("Perfil atualizado com sucesso!", "success");
      return updatedUser;
    } catch (error: any) {
      const errMsg = error?.response?.data?.error || "Erro ao atualizar perfil.";
      showToast(errMsg, "error");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore API errors during logout
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      setIsLoading(false);
      showToast("Você saiu da sua conta.", "info");
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isCheckingAuth,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
