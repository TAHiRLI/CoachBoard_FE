import { MatchPostDto, MatchPutDto } from "@/lib/types/matches.types";

import { apiClient } from "../apiClient";

class MatchesService {
  async getAll(filters: { seasonId?: number; startDate?: string; endDate?: string }) {
    const params = new URLSearchParams();
    if (filters.seasonId) params.append("seasonId", filters.seasonId.toString());
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    return apiClient.get(`api/Matches?${params.toString()}`);
  }

  async getById(id: number) {
    return apiClient.get(`api/Matches/${id}`);
  }

  async create(dto: MatchPostDto) {
    return apiClient.post("api/Matches", dto);
  }

  async update(id: number, dto: MatchPutDto) {
    return apiClient.put(`api/Matches/${id}`, dto);
  }

  async delete(id: number) {
    return apiClient.delete(`api/Matches/${id}`);
  }
}

export const matchesService = new MatchesService();
