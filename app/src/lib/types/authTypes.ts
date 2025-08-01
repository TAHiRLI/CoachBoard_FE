// src/lib/types/authTypes.ts

export interface TUser {
    id: string;
    fullname: string;
    username: string;
    email: string;
    roles: string[];
    token?: string;
    expiresAt?: Date;
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