import { PlayerStatisticsRequestDto } from "@/lib/types/statistics.types";
import { apiClient } from "../apiClient";

class ReportsService {
  async getAll() {
    return apiClient.get("api/Reports");
  }
  async generatePlayerOverview(dto: PlayerStatisticsRequestDto) {
    return apiClient.post("api/Reports/Players/Overview", dto);
  }

  async delete(id: string) {
    return apiClient.delete(`api/Reports/${id}`);
  }
}

export const reportsService = new ReportsService();
