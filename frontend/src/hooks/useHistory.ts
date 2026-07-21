import { useCallback } from "react";
import { api } from "../config/AxiosConfig";
import type { Conversion } from "../types";

export function useHistory() {
  const handleHistory = useCallback(async (): Promise<Conversion[]> => {
    try {
      const res = await api.get("/history");
      return res.data.data || [];
    } catch (error) {
      console.error("Error fetching history", error);
      throw error;
    }
  }, []);

  return { handleHistory };
}