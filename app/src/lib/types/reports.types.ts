export interface ReportGetDto {
  id: string;
  title: string;
  type: ReportTypeEnum;
  fileName?: string;
  fileUrl?: string;
  filtersJson?: string;
  createdAt: string;
}

export enum ReportTypeEnum {
  PlayerOverview = "PlayerOverview",
  PlayerBmi = "PlayerBmi",
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
