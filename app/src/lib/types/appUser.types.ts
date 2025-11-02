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
