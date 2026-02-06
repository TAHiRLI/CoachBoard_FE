export interface PlayerBmiRecordDto {
  id: number;
  playerId: number;
  weightKg: number;
  heightCm: number;
  bmi: number;
  measuredAt: string;
  createdAt: string;
}

export interface PlayerBmiRecordsQuery {
  playerId?: string | number;
  from?: string;
  to?: string;
}

export interface CreatePlayerBmiRecordDto {
  playerId: number;
  weightKg: number;
  heightCm: number;
  measuredAt?: string;
}

export interface UpdatePlayerBmiRecordDto {
  weightKg: number;
  heightCm: number;
  measuredAt?: string;
}
