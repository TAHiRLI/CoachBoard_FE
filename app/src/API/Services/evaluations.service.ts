import { Evaluation, EvaluationPostDto, EvaluationPutDto } from "@/lib/types/evaluation.types";

import { apiClient } from "../apiClient";

class EvaluationsService {
  async getAll(params?: { playerId?: string; matchId?: string; episodeId?: string; clipId?: string  }) {
    return apiClient.get<Evaluation[]>("api/Evaluations", { params });
  }

  async getById(id: string) {
    return apiClient.get<Evaluation>(`api/Evaluations/${id}`);
  }

  async create(dto: EvaluationPostDto) {
    return apiClient.post("api/Evaluations", dto);
  }

  async update(id: string, dto: EvaluationPutDto) {
    return apiClient.put(`api/Evaluations/${id}`, dto);
  }

  async delete(id: string) {
    return apiClient.delete(`api/Evaluations/${id}`);
  }

  async deleteHard(id: string) {
    return apiClient.delete(`api/Evaluations/${id}/hard`);
  }
}

export const evaluationsService = new EvaluationsService();
