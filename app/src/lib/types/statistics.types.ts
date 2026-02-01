export type PlayerStatisticsRequestDto = {
  filter: {
    playerId?: string;
    from?: string;
    to?: string;
    episodeIds?: string[];
    matchIds?: string[];
  };
};

export interface PlayerEpisodeStatistic {
  episode: string;
  episodeId: string;
  totalOccurrences: number;
  successfulOccurrences: number;
  unsuccessfulOccurrences: number;
  criticalSaves: number;
  criticalMistakes: number;
  successRate: number;
}

export interface MonthlyPlayerStatistic {
  month: string;
  successfulEpisodes: number;
  unsuccessfulEpisodes: number;
  criticalSaves: number;
  criticalMistakes: number;
  successRate: number;
  matchCount: number;
  totalMinutes: number;
  averageScore: number;
}

export interface PlayerStatisticsResponseDto {
  playerId: string;
  episodeIds: string[];
  matchIds: string[];
  totalEpisodes: number;
  successfulEpisodes: number;
  unsuccessfulEpisodes: number;
  criticalSaves: number;
  criticalMistakes: number;
  successRate: number;
  episodeStatistics: PlayerEpisodeStatistic[];
  monthlyStatistics: MonthlyPlayerStatistic[];
}
