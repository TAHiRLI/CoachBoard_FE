import { apiClient } from "../apiClient";

class AuthService {
  async login(body: { username: string; password: string }) {
    return apiClient.post("api/auth/login", body);
  }
  async resetPassword(body: { token: string; username: string; password: string }) {
    return apiClient.post("api/auth/ResetPassword", body);
  }
  async getresetPasswordUrl(username: string) {
    return apiClient.post(`api/auth/GetResetPasswordUrl?username=${username}`, {});
  }
  async bookADemo(body: {email:string, fullname: string}) {
    return apiClient.post(`api/auth/bookDemo`, body);
  }
  async resetToDefaultPassword(username:string) {
    return apiClient.post(`api/auth/ResetToDefaultPassword/${username}`, {});
  }
  async getDetails(userId: string) {
    return apiClient.get(`api/auth/accountDetails/${userId}`);
  }

  async getRoles() {
    return apiClient.get(`api/auth/Roles`);
  }
}

export const authService = new AuthService();
