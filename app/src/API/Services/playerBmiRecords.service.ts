import {
  CreatePlayerBmiRecordDto,
  PlayerBmiRecordDto,
  PlayerBmiRecordsQuery,
  UpdatePlayerBmiRecordDto,
} from "@/lib/types/playerBmi.types";

import { apiClient } from "../apiClient";

export const playerBmiRecordsService = {
  getAll: (params?: PlayerBmiRecordsQuery) =>
    apiClient.get<PlayerBmiRecordDto[]>("/api/PlayerBmiRecords", { params }),

  getById: (id: string | number) =>
    apiClient.get<PlayerBmiRecordDto>(`/api/PlayerBmiRecords/${id}`),

  create: (dto: CreatePlayerBmiRecordDto) =>
    apiClient.post<PlayerBmiRecordDto>("/api/PlayerBmiRecords", dto),

  update: (id: string | number, dto: UpdatePlayerBmiRecordDto) =>
    apiClient.put<PlayerBmiRecordDto>(`/api/PlayerBmiRecords/${id}`, dto),

  delete: (id: string | number) =>
    apiClient.delete<void>(`/api/PlayerBmiRecords/${id}`),
};
