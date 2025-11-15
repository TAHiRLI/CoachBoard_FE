// src/lib/types/authTypes.ts

export interface TUser {
  id: string;
  fullname: string;
  username: string;
  email: string;
  coachId: string;
  roles: string[];
  token?: string;
  expiresAt?: Date;
}
export interface KeycloakUserInfo {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}
export interface AuthState {
  user: TUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
