import { TeamPostDto, TeamPutDto } from "@/lib/types/teams.types";

import { apiClient } from "../apiClient";

class TeamsService {
  async getAll() {
    return apiClient.get("api/Teams");
  }

  async getById(id: number) {
    return apiClient.get(`api/Teams/${id}`);
  }

  async create(dto: TeamPostDto) {
    return apiClient.post("api/Teams", dto);
  }

  async update(id: number, dto: TeamPutDto) {
    return apiClient.put(`api/Teams/${id}`, dto);
  }

  async delete(id: number) {
    return apiClient.delete(`api/Teams/${id}`);
  }
}

export const teamsService = new TeamsService();
