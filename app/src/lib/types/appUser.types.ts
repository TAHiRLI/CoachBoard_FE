import { Coach } from "./coach.types";

export interface AppUserDto {
  id: string;
  userName: string;
  email: string;
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
  email: string;
  coachId?: string | null;
  roles: string[];
}

export type UserRole = { id: string; name: string };
