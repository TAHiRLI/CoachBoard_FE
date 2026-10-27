import { Coach } from "./coach.types";

export interface AppUserDto {
  id: string;
  userName: string;
  email: string;
  keycloakId?: string;
  coach?: Coach | null;
  roles: string[];
}

export interface CreateUserDto {
  userName: string;
  email: string;
  password: string;
  roles: string[];
}

export interface UpdateUserDto {
  userName: string;
  keycloakId?: string;
  email: string;
  coachId?: string | null;
  roles: string[];
}

export type UserRole = { id: string; name: string };

// GET api/users/me: who is signed in and which club's data they are working with.
export interface CurrentUserDto {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  roles: string[];
  club?: { id: number; name: string; logo?: string } | null;
  team?: { id: number; name: string } | null;
}
