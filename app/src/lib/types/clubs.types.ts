export type Club = {
  id: string;
  name: string;
  logo?: string;
};

export type ClubWithTeams = Club & {
  teams: {
    id: string;
    name: string;
    league: string;
    clubid: string;
    clubName: string;
  }[];
};

export type ClubPostDto = {
  name: string;
  logo?: File;
};

export type ClubPutDto = {
  name: string;
  logo?: File;
};

export type ClubState = {
  clubs: Club[];
  loading: boolean;
  error: string | null;
  selectedClub: ClubWithTeams | null;
};

