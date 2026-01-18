export interface ReportGetDto {
  id: string;
  title: string;
  description?: string;
  reportType: ReportTypeEnum;
  category: ReportCategoryEnum;
  createdAt: string;
  createdBy?: string;
  filePath?: string;
  fileUrl?: string;
  metadata?: Record<string, any>;
  filter?: any;
}

export enum ReportTypeEnum {
  PlayerOverview = "PlayerOverview",
  TeamPerformance = "TeamPerformance",
  EpisodeAnalysis = "EpisodeAnalysis",
  ComparativeAnalysis = "ComparativeAnalysis",
}

export enum ReportCategoryEnum {
  Player = "player",
  Team = "team",
  Episode = "episode",
  Comparative = "comparative",
}

export interface PlayerOverviewReportRequestDto {
  filter: {
    playerId?: string;
    from?: string;
    to?: string;
    episodeIds?: string[];
    matchIds?: string[];
  };
}

export interface GeneratePlayerOverviewReport_DataResponse {
  reportId?: string;
  success: boolean;
  message?: string;
  data?: any;
}
