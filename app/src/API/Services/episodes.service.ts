import { EpisodePostDto, EpisodePutDto } from "@/lib/types/episodes.types";

import { apiClient } from "../apiClient";

class EpisodesService {
  async getAll() {
    return apiClient.get("api/Episodes");
  }

  async getById(id: string) {
    return apiClient.get(`api/Episodes/${id}`);
  }

  async create(dto: EpisodePostDto) {
    return apiClient.post("api/Episodes", dto);
  }

  async update(id: string, dto: EpisodePutDto) {
    return apiClient.put(`api/Episodes/${id}`, dto);
  }

  async delete(id: string) {
    return apiClient.delete(`api/Episodes/${id}`);
  }
}
export const episodesService = new EpisodesService();
