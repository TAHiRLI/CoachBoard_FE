export type Season = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  createdBy?: string;
  /** Set by the API when today falls within the season. */
  isCurrent?: boolean;
};

export type SeasonPostDto = {
  name: string;
  startDate: string;
  endDate: string;
};

export type SeasonPutDto = {
  name: string;
  startDate: string;
  endDate: string;
};

export type SeasonState = {
  seasons: Season[];
  loading: boolean;
  error: string | null;
  selectedSeason: Season | null;
};
