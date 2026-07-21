import { useAuthContext } from "../context/AuthContext";

export function useAuth() {
  const { login, register, updateProfile, logout, user, token, isAuthenticated, isLoading, isCheckingAuth } = useAuthContext();

  return {
    handleLogin: login,
    handleRegister: register,
    updateProfile,
    logout,
    user,
    token,
    isAuthenticated,
    isLoading,
    isCheckingAuth,
  };
}