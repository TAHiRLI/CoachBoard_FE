import { SeasonPostDto, SeasonPutDto } from "@/lib/types/seasons.types";

import { apiClient } from "../apiClient";

class SeasonsService {
  async getAll() {
    return apiClient.get("api/Seasons");
  }

  async getById(id: string) {
    return apiClient.get(`api/Seasons/${id}`);
  }

  async create(dto: SeasonPostDto) {
    return apiClient.post("api/Seasons", dto);
  }

  async update(id: string, dto: SeasonPutDto) {
    return apiClient.put(`api/Seasons/${id}`, dto);
  }

  async delete(id: string) {
    return apiClient.delete(`api/Seasons/${id}`);
  }
}

export const seasonsService = new SeasonsService();
