import { treatmentProtocolsService } from "@/services/treatmentProtocolService";
import type { TreatmentProtocolsResponse } from "@/types/treatmentProtocol";
import { useQuery } from "@tanstack/react-query";

type TreatmentProtocolsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  targetDisease?: string;
  sortBy?: string;
  sortOrder?: string;
  token: string;
  enabled?: boolean;
};

export function useTreatmentProtocols({
  page = 1,
  limit = 10,
  search = "",
  targetDisease = "HIV",
  sortBy = "createdAt",
  sortOrder = "desc",
  enabled = true,
  token,
}: TreatmentProtocolsQueryParams) {
  return useQuery<TreatmentProtocolsResponse>({
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
