import { Player, PlayerPostDto, PlayerPutDto } from "@/lib/types/players.types";

import { apiClient } from "../apiClient";

export const playersService = {
  getAll: (params?: {
    teamId?: string;
    clubId?: string;
    position?: string;
    search?: string;
  }) =>
    apiClient.get<Player[]>("/api/players", { params }),

  getById: (id: string) =>
    apiClient.get<Player>(`/api/players/${id}`),

  create: (dto: PlayerPostDto) => {
    const formData = new FormData();
    formData.append("fullName", dto.fullName);
    formData.append("birthDate", dto.birthDate);
    formData.append("position", dto.position);
    formData.append("height", dto.height.toString());
    if (dto.teamId !== null && dto.teamId !== undefined)
      formData.append("teamId", dto.teamId.toString());
    if (dto.photo) formData.append("photo", dto.photo);

    return apiClient.post<Player>("/api/players", formData);
  },

  update: (id: string, dto: PlayerPutDto) => {
    const formData = new FormData();
    formData.append("fullName", dto.fullName);
    formData.append("birthDate", dto.birthDate);
    formData.append("position", dto.position);
    formData.append("height", dto.height.toString());
    if (dto.teamId !== null && dto.teamId !== undefined)
      formData.append("teamId", dto.teamId.toString());
    if (dto.photo) formData.append("photo", dto.photo);

    return apiClient.put(`/api/players/${id}`, formData);
  },

  delete: (id: string) =>
    apiClient.delete(`/api/players/${id}`),
};