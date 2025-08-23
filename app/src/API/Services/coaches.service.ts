import { CoachPostDto, CoachPutDto } from "@/lib/types/coach.types";

import { apiClient } from "../apiClient";

class CoachesService {
  async getAll(params?: { teamId?: string; clubId?: string }) {
    return apiClient.get("api/Coaches", { params });
  }

  async getById(id: string) {
    return apiClient.get(`api/Coaches/${id}`);
  }

  async create(dto: CoachPostDto) {
    return apiClient.post("api/Coaches", dto);
  }

  async update(id: string, dto: CoachPutDto) {
    return apiClient.put(`api/Coaches/${id}`, dto);
  }

  async delete(id: string) {
    return apiClient.delete(`api/Coaches/${id}`);
  }

  async assignAppUser(id: string, appUserId: string) {
    return apiClient.post(`api/Coaches/${id}/assign-user?appUserId=${appUserId}`);
  }
}

export const coachesService = new CoachesService();