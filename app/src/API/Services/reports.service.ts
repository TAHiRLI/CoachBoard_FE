import {
  GeneratePlayerOverviewReport_DataResponse,
  PlayerOverviewReportRequestDto,
  ReportGetDto,
} from "@/lib/types/reports.types";

import { apiClient } from "../apiClient";

class ReportsService {
  async getAll() {
    return apiClient.get<ReportGetDto[]>("api/Reports");
  }

  async generatePlayerOverview(dto: PlayerOverviewReportRequestDto) {
    return apiClient.post<GeneratePlayerOverviewReport_DataResponse>("api/Reports/Players/Overview", dto);
  }

  async delete(id: string) {
    return apiClient.delete<void>(`api/Reports/${id}`);
  }
  async getReportFile(id: string) {
    return apiClient.get<Blob>(`api/Reports/${id}/file`, {
      responseType: "blob",
    });
  }
}

export const reportsService = new ReportsService();
