import { apiClient } from "../apiClient";

class ClubsService {
  async getAll() {
    return apiClient.get("api/Clubs");
  }

  async getById(id: string) {
    return apiClient.get(`api/Clubs/${id}`);
  }

  async create(formData: FormData) {
    return apiClient.post("api/Clubs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async update(id: string, formData: FormData) {
    return apiClient.put(`api/Clubs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async delete(id: string) {
    return apiClient.delete(`api/Clubs/${id}`);
  }
}

export const clubsService = new ClubsService();
