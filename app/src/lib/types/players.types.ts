// types/players.types.ts
export interface Player {
  id: string;
  fullName: string;
  birthDate: string;
  photo: string;
  position: string;
  height: number;
  teamId: string;
  teamName: string;
}

export interface PlayerPostDto {
  fullName: string;
  birthDate: string;
  photo?: File;
  position: string;
  height: number;
  teamId?: string;
}

export interface PlayerPutDto {
  fullName: string;
  birthDate: string;
  photo: File | null;
  position: string;
  height: number;
  teamId: string;
}