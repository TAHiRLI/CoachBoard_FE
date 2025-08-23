import { AppUserDto, CreateUserDto, UpdateUserDto } from "@/lib/types/appUser.types";

import { apiClient } from "../apiClient";

const endpoint = "api/users";

export const appUserService = {
  getAll: () => apiClient.get<AppUserDto[]>(endpoint),
  getById: (id: string) => apiClient.get<AppUserDto>(`${endpoint}/${id}`),
  create: (dto: CreateUserDto) => apiClient.post<AppUserDto>(endpoint, dto),
  update: (id: string, dto: UpdateUserDto) => apiClient.put<void>(`${endpoint}/${id}`, dto),
  delete: (id: string) => apiClient.delete<void>(`${endpoint}/hard/${id}`),
};
