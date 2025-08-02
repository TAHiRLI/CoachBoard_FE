export type Season = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  createdBy?: string;
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
