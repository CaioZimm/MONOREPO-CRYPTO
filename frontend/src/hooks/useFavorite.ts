import { useCallback } from "react";
import { api } from "../config/AxiosConfig";
import type { Favorite } from "../types";
import { useToast } from "../context/ToastContext";

export function useFavorite() {
  const { showToast } = useToast();

  const toggleFavorite = useCallback(
    async (cryptoName: string): Promise<{ favorited: boolean; cryptoName: string } | null> => {
      try {
        const res = await api.post("/favorites/toggle", { cryptoName });
        const data = res.data.data;
        if (data?.favorited !== undefined) {
          showToast(
            data.favorited
              ? `${cryptoName.toUpperCase()} adicionado aos favoritos!`
              : `${cryptoName.toUpperCase()} removido dos favoritos.`,
            "info"
          );
        }
        return data;
      } catch (error: any) {
        const errMsg = error?.response?.data?.error || "Erro ao favoritar moeda.";
        showToast(errMsg, "error");
        return null;
      }
    },
    [showToast]
  );

  const listFavorites = useCallback(async (): Promise<Favorite[]> => {
    try {
      const res = await api.get("/favorites");
      return res.data.data || [];
    } catch (error) {
      console.error("Erro ao buscar favoritos", error);
      return [];
    }
  }, []);

  return { toggleFavorite, listFavorites, getFavorite: toggleFavorite, listFavorite: listFavorites };
}