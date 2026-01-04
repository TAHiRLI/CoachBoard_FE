import { apiClient } from "../apiClient";

class Tagservice {
  async getAll() {
    return apiClient.get("api/Tags");
  }

  async create(name: string) {
    return apiClient.post(`api/Tags?name=${name}`);
  }
  
  async delete(id: string) {
    return apiClient.delete(`api/Tags/${id}`);
  }
}

export const tagsService = new Tagservice();
