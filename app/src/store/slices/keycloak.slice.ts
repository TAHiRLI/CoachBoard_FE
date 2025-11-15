import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import keycloak from "@/API/Services/keycloak.service";

export interface UserInfo {
  preferred_username?: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  email?: string;
  roles?: string[];
  [key: string]: any;
}

interface KeycloakState {
  initialized: boolean;
  authenticated: boolean;
  userInfo: UserInfo | null;
  token: string | null;
  error: string | null;
  loading: boolean;
}

const initialState: KeycloakState = {
  initialized: false,
  authenticated: false,
  userInfo: null,
  token: null,
  error: null,
  loading: false,
};

const getKeycloakRoles = (): string[] => {
  if (!keycloak.token) return [];

  try {
    const tokenParsed = keycloak.tokenParsed;
    console.log("🚀 ~ getKeycloakRoles ~ tokenParsed:", tokenParsed);
    const realmRoles = tokenParsed?.roles || [];
    const clientId = keycloak.clientId ?? "";
    const clientRoles = tokenParsed?.[clientId]?.roles || [];
    return [...realmRoles, ...clientRoles];
  } catch (err) {
    console.error("Failed to parse roles:", err);
    return [];
  }
};
// 🔹 Initialize Keycloak & Login
export const initializeKeycloak = createAsyncThunk("keycloak/init", async (_, { rejectWithValue }) => {
  try {
    const authenticated = await keycloak.init({
      onLoad: "login-required",
      checkLoginIframe: false,
      pkceMethod: "S256",
      redirectUri: window.location.origin + window.location.pathname,
    });

    let userInfo = null;
    let roles: string[] = [];

    if (authenticated) {
      try {
        userInfo = await keycloak.loadUserInfo();
        console.log("🔹 User info loaded:", userInfo);
        roles = getKeycloakRoles();
      } catch (err) {
        console.error("Failed to load user info:", err);
      }

      // Setup token refresh
      setInterval(async () => {
        try {
          const refreshed = await keycloak.updateToken(70);
          if (refreshed) console.log("🔄 Token refreshed");
        } catch {
          console.warn("⚠️ Token refresh failed");
        }
      }, 60000);
    }

    return {
      authenticated,
      userInfo: { ...userInfo, roles },
      token: keycloak.token ?? null,
    };
  } catch (err: any) {
    return rejectWithValue(err.message || "Keycloak initialization failed");
  }
});

// 🔹 Logout
export const logoutKeycloak = createAsyncThunk("keycloak/logout", async () => {
  await keycloak.logout();
});

const keycloakSlice = createSlice({
  name: "keycloak",
  initialState,
  reducers: {
    clearKeycloakError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeKeycloak.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeKeycloak.fulfilled, (state, action: PayloadAction<any>) => {
        state.initialized = true;
        state.authenticated = true;
        state.userInfo = action.payload.userInfo;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(initializeKeycloak.rejected, (state, action) => {
        state.initialized = true;
        state.authenticated = false;
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(logoutKeycloak.fulfilled, (state) => {
        state.authenticated = false;
        state.userInfo = null;
        state.token = null;
      });
  },
});

export const { clearKeycloakError } = keycloakSlice.actions;
export default keycloakSlice;
