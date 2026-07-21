import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Dropdown from "../../components/Home/Dropdown/Dropdown";
import { useConvert } from "../../hooks/useConvert";
import type { ConversionResult } from "../../types";
import { FiRefreshCw, FiDollarSign, FiArrowUpRight, FiClock, FiCheckCircle } from "react-icons/fi";

const Convert: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCoin = searchParams.get("coin") || "";

  const [crypto, setCrypto] = useState<string>(initialCoin);
  const [amount, setAmount] = useState<string>("");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { handleConvert } = useConvert();

  useEffect(() => {
    if (initialCoin) {
      setCrypto(initialCoin);
    }
  }, [initialCoin]);

  const submitConvert = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!crypto || !amount || parseFloat(amount) <= 0) {
      setError("Selecione uma criptomoeda e informe uma quantidade positiva.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await handleConvert({
        cryptoName: crypto,
        amount: parseFloat(amount),
      });

      if (res) {
        setResult(res);
      } else {
        setError("Não foi possível obter a cotação no momento.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erro ao processar conversão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <FiRefreshCw className="w-3.5 h-3.5" />
          <span>Câmbio Instantâneo</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Conversor & Cotação em Tempo Real
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto">
          Calcule cotações exatas com cotação direto da rede global e armazene automaticamente no seu portfólio.
        </p>
      </div>

      {/* Main Glass Conversion Portal */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-2xl relative">
        {/* Decorative corner accent mask */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
        </div>

        <form onSubmit={submitConvert} className="space-y-6 relative z-10">
          {/* Crypto Dropdown Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              1. Escolha a Criptomoeda
            </label>
            <Dropdown selected={crypto} setSelected={setCrypto} />
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <span>2. Quantidade de Moedas</span>
              {amount && (
                <span className="text-emerald-400 font-mono">
                  {parseFloat(amount || "0").toLocaleString("pt-BR")} moedas
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                placeholder="Ex: 0.5, 1.25, 100..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.00000001"
                className="glass-input pl-4 pr-12 py-3.5 rounded-xl w-full text-base font-mono font-semibold placeholder:font-sans placeholder:font-normal placeholder:text-zinc-600 shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                {crypto ? crypto.toUpperCase() : "MOEDA"}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading || !crypto || !amount}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-zinc-950 font-bold text-base sm:text-lg rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>Calculando e Registrando...</span>
              </>
            ) : (
              <>
                <span>Calcular Cotação</span>
                <FiArrowUpRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium flex items-center gap-3 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Result Display Card */}
      {result && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-zinc-900/90 to-teal-950/20 shadow-2xl relative overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <FiCheckCircle className="w-6 h-6" />
              <h2 className="text-lg font-bold tracking-tight text-white">
                Resultado da Conversão
              </h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              ● Salvo no Banco
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-1 min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <FiDollarSign className="w-3.5 h-3.5 text-blue-400" />
                Valor em Dólares (USD)
              </span>
              <p
                className="text-2xl sm:text-3xl font-mono font-bold text-blue-400 tracking-tight truncate"
                title={result.usd.toLocaleString("en-US", { style: "currency", currency: "USD" })}
              >
                {result.usd.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-1 min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">R$</span>
                Valor em Reais (BRL)
              </span>
              <p
                className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tracking-tight truncate"
                title={result.brl.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              >
                {result.brl.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
            <span>
              Moeda: <strong className="text-white uppercase font-mono">{result.cryptoName}</strong> | Quantidade: <strong className="text-white font-mono">{result.amount}</strong>
            </span>
            <Link
              to="/home/history"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 transition-colors"
            >
              <FiClock className="w-3.5 h-3.5" />
              Ver no Histórico Completo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Convert;