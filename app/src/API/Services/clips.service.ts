import { Clip, ClipPostDto, ClipPutDto } from "@/lib/types/clips.types";

import { apiClient } from "../apiClient";

class ClipsService {
  async getAll(filter: {
    matchId?: string;
    playerId?: string;
    episodeId?: string;
    searchTerm?: string;
    isExample?: boolean;
  }) {
    const params: any = {};
    if (filter.matchId) params.matchId = filter.matchId;
    if (filter.playerId) params.playerId = filter.playerId;
    if (filter.episodeId) params.episodeId = filter.episodeId;
    if (filter.searchTerm) params.searchTerm = filter.searchTerm;
    if (filter.isExample) params.isExample = filter.isExample;

    return apiClient.get<Clip[]>("api/Clips", { params });
  }

  async getById(id: string) {
    return apiClient.get<Clip>(`api/Clips/${id}`);
  }

  async create(dto: ClipPostDto) {
    const formData = new FormData();
    formData.append("name", dto.name);
    formData.append("startTime", dto.startTime.toString());
    formData.append("endTime", dto.endTime.toString());
    formData.append("createdByCoachId", dto.createdByCoachId.toString());
    formData.append("isExternal", dto.isExternal.toString());
    formData.append("isExample", dto.isExample.toString());
    if (dto.matchId !== null && dto.matchId !== undefined) {
      formData.append("matchId", dto.matchId.toString());
    }
    if (dto.videoFile) {
      formData.append("videoFile", dto.videoFile);
    }
    if (dto.videoUrl) {
      formData.append("videoUrl", dto.videoUrl);
    }

    return apiClient.post("api/Clips", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async update(id: string, dto: ClipPutDto) {
    const formData = new FormData();
    formData.append("name", dto.name);
    formData.append("startTime", dto.startTime.toString());
    formData.append("endTime", dto.endTime.toString());
    formData.append("isExternal", dto.isExternal.toString());
    formData.append("isExample", dto.isExample.toString());
    if (dto.matchId !== null && dto.matchId !== undefined) {
      formData.append("matchId", dto.matchId.toString());
    }
    if (dto.videoFile) {
      formData.append("videoFile", dto.videoFile);
    }
    if (dto.videoUrl) {
      formData.append("videoUrl", dto.videoUrl);
    }

    return apiClient.put(`api/Clips/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async delete(id: string) {
    return apiClient.delete(`api/Clips/${id}`);
  }
  async createTrimRequest(clipId: string) {
    return apiClient.post("api/VideoTrimRequests", { clipId });
  }
}

export const clipsService = new ClipsService();
