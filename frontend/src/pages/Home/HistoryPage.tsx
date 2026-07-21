import React, { useEffect, useState, useMemo } from "react";
import { useHistory } from "../../hooks/useHistory";
import type { Conversion } from "../../types";
import { FiSearch, FiRefreshCw, FiClock, FiCheckCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string>("");

  const { handleHistory } = useHistory();
  const ITEMS_PER_PAGE = 10;

  const fetchHistoryData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const data = await handleHistory();
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]);
      }
    } catch (err: any) {
      setError("Nenhuma conversão registrada em seu histórico ainda.");
      setHistory([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const query = searchQuery.toLowerCase();
    return history.filter((item) => item.cryptoName.toLowerCase().includes(query));
  }, [history, searchQuery]);

  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE) || 1;
  const currentData = useMemo(() => {
    return filteredHistory.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredHistory, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Histórico de Conversões
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {filteredHistory.length} registros
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Registro detalhado de todas as suas cotações e cálculos de câmbio.
          </p>
        </div>

        <button
          onClick={() => fetchHistoryData(true)}
          disabled={refreshing || loading}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all font-medium text-sm disabled:opacity-50 cursor-pointer shadow-md"
        >
          <FiRefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-emerald-400" : ""}`} />
          <span>{refreshing ? "Atualizando..." : "Atualizar"}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-zinc-800/80 shadow-lg">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Filtrar por nome da moeda (ex: bitcoin)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input pl-10 pr-4 py-2.5 rounded-xl w-full text-sm placeholder:text-zinc-500"
          />
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400">
          <FiClock className="w-4 h-4 text-emerald-400" />
          <span>Sincronizado via Redis & PostgreSQL</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-zinc-400 font-medium">Buscando transações e cotações...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4 shadow-inner">
              <FiClock className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">Nenhum registro encontrado</h3>
            <p className="text-sm text-zinc-400 mt-1 max-w-sm">
              {error || (searchQuery ? `Nenhuma transação de "${searchQuery}" foi encontrada no histórico.` : "Faça sua primeira conversão para visualizá-la aqui no histórico.")}
            </p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                    <th className="py-3.5 pl-6 pr-4">Status</th>
                    <th className="py-3.5 px-4">Ativo</th>
                    <th className="py-3.5 px-4 text-right">Quantidade</th>
                    <th className="py-3.5 px-4 text-right">Valor em USD</th>
                    <th className="py-3.5 px-4 text-right">Valor em BRL</th>
                    <th className="py-3.5 pl-4 pr-6 text-right">Data / Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-sm">
                  {currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                      {/* Status */}
                      <td className="py-4 pl-6 pr-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <FiCheckCircle className="w-3.5 h-3.5" />
                          <span>Concluído</span>
                        </span>
                      </td>

                      {/* Asset */}
                      <td className="py-4 px-4 font-bold text-white uppercase tracking-wide">
                        {item.cryptoName}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 text-right font-mono text-zinc-300 font-medium">
                        {Number(item.amount).toLocaleString("en-US", { maximumFractionDigits: 8 })}
                      </td>

                      {/* USD */}
                      <td className="py-4 px-4 text-right font-mono font-semibold text-blue-400">
                        {Number(item.usd).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>

                      {/* BRL */}
                      <td className="py-4 px-4 text-right font-mono font-semibold text-emerald-400">
                        {Number(item.brl).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>

                      {/* Date */}
                      <td className="py-4 pl-4 pr-6 text-right font-mono text-xs text-zinc-400 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between gap-4">
                <span className="text-xs text-zinc-400">
                  Página <strong className="text-white font-mono">{currentPage}</strong> de{" "}
                  <strong className="text-white font-mono">{totalPages}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`w-8 h-8 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                        num === currentPage
                          ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;