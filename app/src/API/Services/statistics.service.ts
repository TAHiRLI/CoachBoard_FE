import { PlayerStatisticsRequestDto } from "@/lib/types/statistics.types";
import { apiClient } from "../apiClient";

class StatisticsService {
 

  async getPlayerOverview(dto: PlayerStatisticsRequestDto) {
    return apiClient.post("api/Statistics/player", dto);
  }
}

export const statisticsService = new StatisticsService();
