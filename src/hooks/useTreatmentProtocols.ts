import type { TreatmentProtocolType } from "@/types/treatmentProtocol";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useTreatmentProtocols({
  page = 1,
  limit = 10,
  search = "",
  targetDisease = "HIV",
  enabled = true,
  token,
}: {
  page?: number;
  limit?: number;
  search?: string;
  targetDisease?: string;
  enabled?: boolean;
  token: string;
}) {
  return useQuery({
    queryKey: ["treatment-protocols", { page, limit, search, targetDisease }],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/treatment-protocols`, {
        params: { page, limit, search, targetDisease },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      return res.data.data as TreatmentProtocolType[];
    },
    enabled,
  });
}
