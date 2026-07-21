import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCryptos } from "../../services/coinGeckoService";
import { useFavorite } from "../../hooks/useFavorite";
import type { Crypto } from "../../types";
import {
  FiSearch,
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiStar,
  FiArrowRight,
} from "react-icons/fi";
import { FaStar as FaStarSolid } from "react-icons/fa";

const MarketPage: React.FC = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterTab, setFilterTab] = useState<"all" | "gainers" | "losers" | "favorites">("all");
  const [togglingFav, setTogglingFav] = useState<Record<string, boolean>>({});

  const { toggleFavorite, listFavorites } = useFavorite();
  const navigate = useNavigate();

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [coinsData, favsData] = await Promise.all([getCryptos(), listFavorites()]);
      setCryptos(coinsData);
      setFavorites(favsData.map((f) => f.cryptoName));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFavClick = async (cryptoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTogglingFav((prev) => ({ ...prev, [cryptoId]: true }));
    try {
      const res = await toggleFavorite(cryptoId);
      if (res !== null) {
        setFavorites((prev) =>
          prev.includes(cryptoId) ? prev.filter((id) => id !== cryptoId) : [...prev, cryptoId]
        );
      }
    } finally {
      setTogglingFav((prev) => ({ ...prev, [cryptoId]: false }));
    }
  };

  const formatMarketCap = (num?: number) => {
    if (!num) return "—";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const filteredCryptos = useMemo(() => {
    return cryptos.filter((coin) => {
      const matchesSearch =
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterTab === "gainers") return (coin.price_change_percentage_24h ?? 0) > 0;
      if (filterTab === "losers") return (coin.price_change_percentage_24h ?? 0) < 0;
      if (filterTab === "favorites") return favorites.includes(coin.id);
      return true;
    });
  }, [cryptos, searchQuery, filterTab, favorites]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Mercado de Criptomoedas
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
              ● Ao Vivo
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Cotações em tempo real atualizadas diretamente pela rede global.
          </p>
        </div>

        <button
          onClick={() => loadData(true)}
          disabled={refreshing || loading}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all font-medium text-sm disabled:opacity-50 cursor-pointer shadow-lg"
        >
          <FiRefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-emerald-400" : ""}`} />
          <span>{refreshing ? "Atualizando..." : "Atualizar Dados"}</span>
        </button>
      </div>

      {/* Search & Tabs */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nome ou símbolo (ex: BTC)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input pl-10 pr-4 py-2.5 rounded-xl w-full text-sm placeholder:text-zinc-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900/90 border border-zinc-800/80 rounded-xl overflow-x-auto text-xs font-medium">
          {(
            [
              { id: "all", label: "Top 100" },
              { id: "gainers", label: "🚀 Em Alta" },
              { id: "losers", label: "🔻 Em Baixa" },
              { id: "favorites", label: "⭐ Favoritas" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                filterTab === tab.id
                  ? "bg-emerald-500 text-zinc-950 font-semibold shadow-md shadow-emerald-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-zinc-400 font-medium">Carregando cotações ao vivo...</p>
          </div>
        ) : filteredCryptos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <p className="text-base font-semibold text-zinc-300">Nenhuma moeda encontrada</p>
            <p className="text-sm text-zinc-500 mt-1">
              Tente alterar sua busca ou a aba de filtro selecionada.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                  <th className="py-3.5 pl-6 pr-3 w-12 text-center">Fav</th>
                  <th className="py-3.5 px-3"># Rank</th>
                  <th className="py-3.5 px-4">Ativo</th>
                  <th className="py-3.5 px-4 text-right">Preço (USD)</th>
                  <th className="py-3.5 px-4 text-right">Variação 24h</th>
                  <th className="py-3.5 px-4 text-right hidden md:table-cell">Cap. Mercado</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-sm">
                {filteredCryptos.map((coin) => {
                  const isFav = favorites.includes(coin.id);
                  const isBusy = togglingFav[coin.id];
                  const change = coin.price_change_percentage_24h ?? 0;
                  const isPositive = change >= 0;

                  return (
                    <tr
                      key={coin.id}
                      onClick={() => navigate(`/home?coin=${coin.id}`)}
                      className="hover:bg-zinc-800/40 transition-colors duration-150 cursor-pointer group"
                    >
                      {/* Favorite Button */}
                      <td
                        className="py-4 pl-6 pr-3 text-center"
                        onClick={(e) => handleFavClick(coin.id, e)}
                      >
                        <button
                          disabled={isBusy}
                          className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-400 hover:text-yellow-400 focus:outline-none"
                          title={isFav ? "Remover favorito" : "Adicionar favorito"}
                        >
                          {isBusy ? (
                            <div className="w-4 h-4 border border-yellow-400 border-t-transparent rounded-full animate-spin inline-block" />
                          ) : isFav ? (
                            <FaStarSolid className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                          ) : (
                            <FiStar className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                          )}
                        </button>
                      </td>

                      {/* Rank */}
                      <td className="py-4 px-3 font-mono text-xs text-zinc-500 font-semibold">
                        #{coin.market_cap_rank || "—"}
                      </td>

                      {/* Name & Symbol */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-7 h-7 rounded-full bg-zinc-800 p-0.5"
                          />
                          <div>
                            <p className="font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors leading-snug">
                              {coin.name}
                            </p>
                            <span className="text-xs font-mono font-medium text-zinc-500 uppercase">
                              {coin.symbol}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 text-right font-mono font-semibold text-zinc-100">
                        ${coin.current_price < 1 ? coin.current_price.toFixed(6) : coin.current_price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* 24h Change */}
                      <td className="py-4 px-4 text-right font-mono">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
                            isPositive
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {isPositive ? (
                            <FiTrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <FiTrendingDown className="w-3.5 h-3.5" />
                          )}
                          {isPositive ? "+" : ""}
                          {change.toFixed(2)}%
                        </span>
                      </td>

                      {/* Market Cap */}
                      <td className="py-4 px-4 text-right font-mono text-zinc-400 hidden md:table-cell">
                        {formatMarketCap(coin.market_cap)}
                      </td>

                      {/* Quick Action */}
                      <td className="py-4 pl-4 pr-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/home?coin=${coin.id}`);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 font-semibold text-xs transition-all duration-200 shadow-sm cursor-pointer group-hover:border-emerald-500/40 border border-transparent"
                        >
                          <span>Converter</span>
                          <FiArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPage;
