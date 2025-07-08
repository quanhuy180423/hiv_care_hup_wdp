import type { TreatmentProtocolType } from "@/types/treatmentProtocol";
import { useQuery } from "@tanstack/react-query";
import { treatmentProtocolsService } from "@/services/treatmentProtocolService";

export function useTreatmentProtocols({
  page = 1,
  limit = 10,
  search = "",
  targetDisease = "HIV",
  sortBy = "createdAt",
  sortOrder = "desc",
  enabled = true,
  token,
}: {
  page?: number;
  limit?: number;
  search?: string;
  targetDisease?: string;
  sortBy?: string;
  sortOrder?: string;
  enabled?: boolean;
  token: string;
}) {
  return useQuery<TreatmentProtocolType[]>({
    queryKey: [
      "treatment-protocols",
      { page, limit, search, targetDisease, sortBy, sortOrder },
    ],
    queryFn: () =>
      treatmentProtocolsService.getAll({
        page,
        limit,
        search,
        targetDisease,
        sortBy,
        sortOrder,
        token,
      }),
    enabled,
  });
}
