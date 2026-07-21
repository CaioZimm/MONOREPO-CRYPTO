import React, { Fragment, useCallback, useEffect, useState, useMemo } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { getCryptos } from "../../../services/coinGeckoService";
import { useFavorite } from "../../../hooks/useFavorite";
import type { Crypto } from "../../../types";
import { FiChevronDown, FiSearch, FiStar } from "react-icons/fi";
import { FaStar as FaStarSolid } from "react-icons/fa";

interface DropdownProps {
  selected: string;
  setSelected: (value: string) => void;
  cryptosList?: Crypto[];
}

const Dropdown: React.FC<DropdownProps> = ({ selected, setSelected, cryptosList }) => {
  const [cryptos, setCryptos] = useState<Crypto[]>(cryptosList || []);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { toggleFavorite, listFavorites } = useFavorite();

  useEffect(() => {
    if (cryptosList && cryptosList.length > 0) {
      setCryptos(cryptosList);
    } else {
      getCryptos().then((data) => setCryptos(data));
    }

    listFavorites().then((data) => {
      setFavorites(data.map((fav) => fav.cryptoName));
    });
  }, [cryptosList, listFavorites]);

  const handleToggleFavorite = useCallback(
    async (cryptoId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setLoadingFavorites((prev) => ({ ...prev, [cryptoId]: true }));

      try {
        const res = await toggleFavorite(cryptoId);
        if (res !== null) {
          setFavorites((prev) =>
            prev.includes(cryptoId) ? prev.filter((id) => id !== cryptoId) : [...prev, cryptoId]
          );
        }
      } finally {
        setLoadingFavorites((prev) => ({ ...prev, [cryptoId]: false }));
      }
    },
    [toggleFavorite]
  );

  const selectedCrypto = useMemo(() => {
    return cryptos.find((c) => c.id === selected);
  }, [cryptos, selected]);

  const filteredCryptos = useMemo(() => {
    if (!searchQuery.trim()) return cryptos;
    const query = searchQuery.toLowerCase();
    return cryptos.filter(
      (c) => c.name.toLowerCase().includes(query) || c.symbol.toLowerCase().includes(query)
    );
  }, [cryptos, searchQuery]);

  return (
    <div className="relative w-full">
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <div className="w-full relative">
            <Listbox.Button className="glass-input w-full px-4 py-3.5 rounded-xl text-left cursor-pointer flex items-center justify-between shadow-lg focus:ring-2 focus:ring-emerald-500/30 transition-all">
              {selectedCrypto ? (
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCrypto.image}
                    alt={selectedCrypto.name}
                    className="w-6 h-6 rounded-full bg-zinc-800 p-0.5 shrink-0"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-semibold text-white">{selectedCrypto.name}</span>
                    <span className="text-xs font-mono uppercase bg-zinc-800/80 px-2 py-0.5 rounded text-zinc-400">
                      {selectedCrypto.symbol}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-zinc-500 text-sm font-medium">Selecione uma criptomoeda para converter</span>
              )}

              <div className="flex items-center gap-3">
                {selectedCrypto && (
                  <span className="text-sm font-mono text-emerald-400 font-semibold hidden sm:inline">
                    ${selectedCrypto.current_price < 1 ? selectedCrypto.current_price.toFixed(6) : selectedCrypto.current_price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                )}
                <FiChevronDown
                  className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180 text-emerald-400" : ""
                    }`}
                />
              </div>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Listbox.Options className="absolute top-full mt-2 z-50 w-full bg-zinc-900/95 border border-zinc-800/90 rounded-2xl shadow-2xl backdrop-blur-2xl max-h-80 overflow-hidden flex flex-col">
                {/* Search Header inside Dropdown */}
                <div className="p-3 border-b border-zinc-800/80 bg-zinc-950/60 sticky top-0 z-10">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar moeda (ex: BTC, Ethereum)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors font-sans"
                    />
                  </div>
                </div>

                {/* Options List */}
                <div className="overflow-y-auto divide-y divide-zinc-800/40 flex-1">
                  {filteredCryptos.length === 0 ? (
                    <div className="p-6 text-center text-xs text-zinc-500">
                      Nenhuma moeda encontrada para "{searchQuery}"
                    </div>
                  ) : (
                    filteredCryptos.map((crypto) => {
                      const isFav = favorites.includes(crypto.id);
                      const isBusy = loadingFavorites[crypto.id];

                      return (
                        <Listbox.Option
                          key={crypto.id}
                          value={crypto.id}
                          className={({ active }) =>
                            `cursor-pointer select-none px-4 py-3 flex items-center justify-between transition-colors ${active ? "bg-zinc-800/70 text-white" : "text-zinc-300"
                            }`
                          }
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs font-mono text-zinc-600 w-6 text-right shrink-0">
                              #{crypto.market_cap_rank || "—"}
                            </span>
                            <img
                              src={crypto.image}
                              alt={crypto.name}
                              className="w-6 h-6 rounded-full bg-zinc-800 p-0.5 shrink-0"
                            />
                            <div className="truncate">
                              <span className="font-semibold text-sm mr-2">{crypto.name}</span>
                              <span className="text-xs font-mono uppercase text-zinc-500">
                                {crypto.symbol}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-xs font-mono font-medium text-zinc-400">
                              ${crypto.current_price < 1 ? crypto.current_price.toFixed(6) : crypto.current_price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => handleToggleFavorite(crypto.id, e)}
                              disabled={isBusy}
                              className="p-1 rounded hover:bg-zinc-700/60 transition-colors text-zinc-500 hover:text-yellow-400 cursor-pointer focus:outline-none"
                              title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                            >
                              {isBusy ? (
                                <div className="w-3.5 h-3.5 border border-yellow-400 border-t-transparent rounded-full animate-spin inline-block" />
                              ) : isFav ? (
                                <FaStarSolid className="w-3.5 h-3.5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                              ) : (
                                <FiStar className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </Listbox.Option>
                      );
                    })
                  )}
                </div>
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
};

export default Dropdown;