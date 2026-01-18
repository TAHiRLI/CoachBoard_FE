import {
  GeneratePlayerOverviewReport_DataResponse,
  PlayerOverviewReportRequestDto,
  ReportGetDto,
} from "@/lib/types/reports.types";
import { apiClient } from "../apiClient";
import { AxiosResponse } from "axios";

class ReportsService {
  async getAll(): Promise<AxiosResponse<ReportGetDto[]>> {
    return apiClient.get<ReportGetDto[]>("api/Reports");
  }

  async generatePlayerOverview(
    dto: PlayerOverviewReportRequestDto
  ): Promise<AxiosResponse<GeneratePlayerOverviewReport_DataResponse>> {
    return apiClient.post<GeneratePlayerOverviewReport_DataResponse>(
      "api/Reports/Players/Overview",
      dto
    );
  }

  async delete(id: string): Promise<AxiosResponse<void>> {
    return apiClient.delete<void>(`api/Reports/${id}`);
  }
}

export const reportsService = new ReportsService();
