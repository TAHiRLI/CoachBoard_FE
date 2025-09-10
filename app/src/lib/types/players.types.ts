// types/players.types.ts
export type Player = {
  id: string;
  fullName: string;
  birthDate: string;
  photo: string;
  position: string;
  height: number;
  teamId: string;
  teamName: string;
};

export type DetailedPlayer = Player & {
  clubName?: string;
  clubLogo?: string;
};
export type PlayerPostDto = {
  fullName: string;
  birthDate: string;
  photo?: File;
  position: string;
  height: number;
  teamId?: string;
};

export type PlayerPutDto = {
  fullName: string;
  birthDate: string;
  photo: File | null;
  position: string;
  height: number;
  teamId: string;
};
