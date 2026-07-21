import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorite } from "../../hooks/useFavorite";
import { getCryptos } from "../../services/coinGeckoService";
import type { Crypto, Favorite } from "../../types";
import { FiStar, FiRefreshCw, FiArrowRight, FiTrendingUp, FiTrendingDown, FiPlus } from "react-icons/fi";
import { FaStar as FaStarSolid } from "react-icons/fa";

const FavoritePage: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [togglingFav, setTogglingFav] = useState<Record<string, boolean>>({});

  const { listFavorites, toggleFavorite } = useFavorite();
  const navigate = useNavigate();

  const loadFavoritesData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [favsData, coinsData] = await Promise.all([listFavorites(), getCryptos()]);
      setFavorites(favsData);
      setCryptos(coinsData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFavoritesData();
  }, []);

  const handleRemoveFavorite = async (cryptoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTogglingFav((prev) => ({ ...prev, [cryptoId]: true }));
    try {
      const res = await toggleFavorite(cryptoId);
      if (res !== null) {
        setFavorites((prev) => prev.filter((f) => f.cryptoName !== cryptoId));
      }
    } finally {
      setTogglingFav((prev) => ({ ...prev, [cryptoId]: false }));
    }
  };

  const favoriteCryptos = useMemo(() => {
    const favNames = favorites.map((f) => f.cryptoName);
    return cryptos.filter((c) => favNames.includes(c.id));
  }, [favorites, cryptos]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Criptomoedas Favoritas
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              ⭐ {favorites.length} salvos
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Seus ativos monitorados para acesso rápido e conversão instantânea.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadFavoritesData(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all font-medium text-sm disabled:opacity-50 cursor-pointer shadow-md"
          >
            <FiRefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-emerald-400" : ""}`} />
            <span>{refreshing ? "Atualizando..." : "Atualizar"}</span>
          </button>

          <button
            onClick={() => navigate("/home/market")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-sm transition-all cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <FiPlus className="w-4 h-4" />
            <span>Explorar Mercado</span>
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="glass-panel rounded-2xl flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-400 font-medium">Carregando moedas favoritas...</p>
        </div>
      ) : favoriteCryptos.length === 0 ? (
        <div className="glass-panel rounded-2xl flex flex-col items-center justify-center py-20 px-4 text-center border border-zinc-800/80">
          <div className="w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-4 shadow-inner">
            <FiStar className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">Nenhuma moeda favoritada</h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-sm">
            Você pode favoritar ativos no mercado ou na lista de seleção para acompanhá-los aqui.
          </p>
          <button
            onClick={() => navigate("/home/market")}
            className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 cursor-pointer flex items-center gap-2"
          >
            <span>Ir para o Mercado ao Vivo</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteCryptos.map((coin) => {
            const isBusy = togglingFav[coin.id];
            const change = coin.price_change_percentage_24h ?? 0;
            const isPositive = change >= 0;

            return (
              <div
                key={coin.id}
                onClick={() => navigate(`/home?coin=${coin.id}`)}
                className="glass-card rounded-2xl p-5 border border-zinc-800/80 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xl relative overflow-hidden"
              >
                {/* Top Row: Coin Info & Star */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-10 h-10 rounded-full bg-zinc-800 p-1 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="truncate">
                      <h4 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors truncate">
                        {coin.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono uppercase font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {coin.symbol}
                        </span>
                        <span className="text-xs font-mono text-zinc-500">
                          #{coin.market_cap_rank || "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleRemoveFavorite(coin.id, e)}
                    disabled={isBusy}
                    className="p-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/80 text-yellow-400 transition-colors cursor-pointer shrink-0 focus:outline-none"
                    title="Remover dos favoritos"
                  >
                    {isBusy ? (
                      <div className="w-4 h-4 border border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaStarSolid className="w-4 h-4 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                    )}
                  </button>
                </div>

                {/* Middle Row: Price & 24h Change */}
                <div className="my-6 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Preço Atual
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                        isPositive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {isPositive ? <FiTrendingUp className="w-3.5 h-3.5" /> : <FiTrendingDown className="w-3.5 h-3.5" />}
                      {isPositive ? "+" : ""}
                      {change.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-2xl font-mono font-bold text-white tracking-tight">
                    ${coin.current_price < 1 ? coin.current_price.toFixed(6) : coin.current_price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Bottom Row: Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/home?coin=${coin.id}`);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 group-hover:bg-emerald-500 text-zinc-300 group-hover:text-zinc-950 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Converter Agora</span>
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritePage;