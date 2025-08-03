export type Episode = {
  id: string;
  name: string;
  description: string;
  evaluationCount: number;
};

export type EpisodePostDto = {
  name: string;
  description: string;
};

export type EpisodePutDto = {
  name: string;
  description: string;
};

export type EpisodeState = {
  episodes: Episode[];
  loading: boolean;
  error: string | null;
  selectedEpisode: Episode | null;
};