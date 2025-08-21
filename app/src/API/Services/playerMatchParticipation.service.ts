import {
  PlayerMatchParticipationPostDto,
  PlayerMatchParticipationPutDto,
} from "@/lib/types/playerMatchParticipation.types";

import { apiClient } from "../apiClient";

class PlayerMatchParticipationService {
  async getAll(matchId?: string, playerId?: string) {
    const params: Record<string, string> = {};
    if (matchId) params.matchId = matchId;
    if (playerId) params.playerId = playerId;
    return apiClient.get("api/PlayerMatchParticipations", { params });
  }

  async getById(id: string) {
    return apiClient.get(`api/PlayerMatchParticipations/${id}`);
  }

  async getMinutesByPlayerInSeason(playerId: string, seasonId: string) {
    return apiClient.get(`api/PlayerMatchParticipations/stats/player/${playerId}/season/${seasonId}`);
  }

  async create(dto: PlayerMatchParticipationPostDto) {
    return apiClient.post("api/PlayerMatchParticipations", dto);
  }

  async update(id: string, dto: PlayerMatchParticipationPutDto) {
    return apiClient.put(`api/PlayerMatchParticipations/${id}`, dto);
  }

  async delete(id: string) {
    return apiClient.delete(`api/PlayerMatchParticipations/${id}`);
  }

  async deleteHard(id: string) {
    return apiClient.delete(`api/PlayerMatchParticipations/${id}/hard`);
  }
}

export const playerMatchParticipationService = new PlayerMatchParticipationService();
