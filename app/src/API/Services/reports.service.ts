import {
  GeneratePlayerOverviewReport_DataResponse,
  PlayerOverviewReportRequestDto,
  ReportGetDto,
} from "@/lib/types/reports.types";

import { apiClient } from "../apiClient";

class ReportsService {
  async getAll(){
    return apiClient.get<ReportGetDto[]>("api/Reports");
  }

  async generatePlayerOverview(dto: PlayerOverviewReportRequestDto) {
    return apiClient.post<GeneratePlayerOverviewReport_DataResponse>("api/Reports/Players/Overview", dto);
  }

  async delete(id: string) {
    return apiClient.delete<void>(`api/Reports/${id}`);
  }
}

export const reportsService = new ReportsService();
