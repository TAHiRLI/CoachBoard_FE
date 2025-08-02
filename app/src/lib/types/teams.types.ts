export type Team = {
  id: string;
  name: string;
  league: string;
  clubId: string;
  clubName: string;
};

export type TeamPostDto = {
  name: string;
  league: string;
  clubId: string;
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


