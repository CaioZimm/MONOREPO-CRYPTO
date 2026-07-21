import { coinGeckoApi } from "../config/AxiosConfig";
import type { Crypto } from "../types";

const cryptoCache = {
  data: null as Crypto[] | null,
  timestamp: 0,
  ttl: 3 * 60 * 1000,
};

export const getCryptos = async (): Promise<Crypto[]> => {
  if (Date.now() - cryptoCache.timestamp < cryptoCache.ttl && cryptoCache.data) {
    return cryptoCache.data;
  }

  try {
    const res = await coinGeckoApi.get("/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        sparkline: false,
        price_change_percentage: "24h",
      },
    });

    cryptoCache.data = res.data;
    cryptoCache.timestamp = Date.now();

    return res.data;
  } catch (error) {
    if (cryptoCache.data) {
      console.warn("Error fetching CoinGecko data, returning cached data:", error);
      return cryptoCache.data;
    }
    console.error("Error fetching CoinGecko data:", error);
    return [];
  }
};