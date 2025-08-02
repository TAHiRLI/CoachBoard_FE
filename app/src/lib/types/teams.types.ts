export type Team = {
  id: number;
  name: string;
  league: string;
  clubId: number;
  clubName: string;
};

export type TeamPostDto = {
  name: string;
  league: string;
  clubId: number;
};

export type TeamPutDto = {
  name: string;
  league: string;
};

export type TeamState = {
  teams: Team[];
  loading: boolean;
  error: string | null;
  selectedTeam: Team | null;
};


