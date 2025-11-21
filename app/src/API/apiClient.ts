import Cookies from "universal-cookie";
import { apiUrl } from "@/lib/constants/constants";
import axios from "axios";
import keycloak from "@/API/Services/keycloak.service";

const cookies = new Cookies();

// Create Axios instance for API
export const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 100000,
});

// Add Request Interceptor for Keycloak Token
apiClient.interceptors.request.use(
  async (config: any) => {
    try {
      // Check if Keycloak is initialized and authenticated
      if (keycloak.authenticated && keycloak.token) {
        // Try to update token if it's about to expire (within 30 seconds)
        try {
          await keycloak.updateToken(30);
        } catch (error) {
          console.error("Token update failed:", error);
          // Token refresh failed, will try to use existing token
        }

        // Add the token to the request
        config.headers.Authorization = `Bearer ${keycloak.token}`;
        
        // Also store in cookies for persistence (optional)
        cookies.set("keycloak_token", keycloak.token, { 
          path: '/',
          secure: true,
          sameSite: 'strict'
        });
      }
    } catch (error) {
      console.error("Error in request interceptor:", error);
    }
    
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Add Response Interceptor for Error Handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config as any & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the Keycloak token
        const refreshed = await keycloak.updateToken(-1); // Force refresh
        
        if (refreshed && keycloak.token) {
          console.log("🔄 Token refreshed successfully");
          
          // Update the authorization header with new token
          originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
          
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
        
        // Token refresh failed, redirect to login
        await handleAuthenticationFailure();
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("❌ Access denied - insufficient permissions");
      // You can redirect to an unauthorized page or show a message
    }

    return Promise.reject(error);
  }
);

// Handle Authentication Failure
async function handleAuthenticationFailure() {
  try {
    // Clear cookies
    cookies.remove("keycloak_token", { path: '/' });
    
    // Trigger Keycloak logout and redirect to login
    await keycloak.logout({
      redirectUri: window.location.origin
    });
  } catch (error) {
    console.error("Logout failed:", error);
    // Force redirect to login page
    window.location.href = '/';
  }
}

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
  return keycloak.authenticated ?? false;
}

// Helper function to get current user info
export function getCurrentUser() {
  if (!keycloak.authenticated || !keycloak.tokenParsed) {
    return null;
  }
  
  return {
    username: keycloak.tokenParsed.preferred_username,
    email: keycloak.tokenParsed.email,
    name: keycloak.tokenParsed.name,
    roles: keycloak.tokenParsed.realm_access?.roles || [],
    clientRoles: keycloak.tokenParsed.resource_access || {},
    sub: keycloak.tokenParsed.sub,
  };
}

// Helper function to check if user has a specific role
export function hasRole(role: string): boolean {
  return keycloak.hasRealmRole(role);
}

// Helper function to check if user has any of the specified roles
export function hasAnyRole(roles: string[]): boolean {
  return roles.some(role => keycloak.hasRealmRole(role));
}

// Helper function to get the current token
export function getToken(): string | undefined {
  return keycloak.token;
}

// Helper function to manually refresh token
export async function refreshToken(): Promise<boolean> {
  try {
    return await keycloak.updateToken(-1);
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
}

// Export keycloak instance for direct access if needed
export { keycloak };

export default apiClient;