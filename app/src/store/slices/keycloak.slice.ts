import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import keycloak from "@/API/Services/keycloak.service";

interface UserInfo {
  preferred_username?: string;
  email?: string;
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

// 🔹 Initialize Keycloak & Login
export const initializeKeycloak = createAsyncThunk("keycloak/init", async (_, { rejectWithValue }) => {
  try {
    console.log("🔹 Starting Keycloak initialization...");

    const authenticated = await keycloak.init({
      onLoad: "login-required",
      checkLoginIframe: false,
      pkceMethod: "S256",
      redirectUri: window.location.origin + window.location.pathname,
    });

    console.log("🔹 Keycloak initialized. Authenticated:", authenticated);

    let userInfo = null;
    if (authenticated) {
      try {
        userInfo = await keycloak.loadUserInfo();
        console.log("🔹 User info loaded:", userInfo);
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
      userInfo,
      token: keycloak.token ?? null,
    };
  } catch (err: any) {
    console.error("❌ Keycloak init failed:", err);
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
