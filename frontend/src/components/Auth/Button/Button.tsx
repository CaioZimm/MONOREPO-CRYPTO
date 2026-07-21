import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

const Button: React.FC<ButtonProps> = ({
  text,
  loading = false,
  variant = "primary",
  disabled,
  className = "",
  ...props
}) => {
  const baseStyles =
    "w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-zinc-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40",
    secondary:
      "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/80 shadow-md",
    outline:
      "bg-transparent border border-emerald-500/50 hover:border-emerald-500 text-emerald-400 hover:bg-emerald-500/10",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
          <span>Carregando...</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
};

export default Button;