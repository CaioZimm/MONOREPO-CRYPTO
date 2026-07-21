import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, error, icon, className = "", ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : props.type;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          {...props}
          type={inputType}
          className={`glass-input w-full ${
            icon ? "pl-10" : "pl-4"
          } ${isPassword ? "pr-11" : "pr-4"} py-3 rounded-xl text-sm placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/30 transition-all ${
            error ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : ""
          } ${className}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-emerald-400 focus:outline-none transition-colors p-1"
            title={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );
};

export default Input;