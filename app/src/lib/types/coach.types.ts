export type Coach = {
  id: string;
  fullName: string;
  email: string;
  teamId: number;
  teamName: string;
  appUserId?: string | null;
};

export type CoachPostDto = {
  fullName: string;
  email: string;
  teamId: number;
  appUserId?: string | null;
};

export type CoachPutDto = {
  fullName: string;
  email: string;
  teamId: number;
  appUserId?: string | null;
};

export type CoachState = {
  coaches: Coach[];
  selectedCoach: Coach | null;
  loading: boolean;
  error: string | null;
};