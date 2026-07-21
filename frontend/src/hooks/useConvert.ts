import { useCallback } from "react";
import { api } from "../config/AxiosConfig";
import type { ConversionResult } from "../types";
import { useToast } from "../context/ToastContext";

export function useConvert() {
  const { showToast } = useToast();

  const handleConvert = useCallback(
    async ({
      cryptoName,
      amount,
    }: {
      cryptoName: string;
      amount: number;
    }): Promise<ConversionResult | null> => {
      try {
        const response = await api.post("/conversion", { cryptoName, amount });
        showToast("Conversão calculada e registrada com sucesso!", "success");
        return response.data.data;
      } catch (error: any) {
        const errMsg = error?.response?.data?.error || "Erro ao realizar conversão.";
        showToast(errMsg, "error");
        throw error;
      }
    },
    [showToast]
  );

  return { handleConvert };
}