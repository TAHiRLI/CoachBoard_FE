import { AuthState, TUser } from "../../lib/types/authTypes";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { AppDispatch } from "../store";
import Cookies from "universal-cookie";

const cookies = new Cookies();

// Initial state
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Triggered when login starts
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        // Triggered when login is successful
        loginSuccess: (state, action: PayloadAction<TUser>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;

            // Store user data in cookies
            cookies.set("user", action.payload, { path: "/" });
        },
        // Triggered when login fails
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // Set user data from cookies or another source
        setUser: (state, action: PayloadAction<TUser>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.error = null;
        },
        // Update authentication token
        updateToken: (state, action: PayloadAction<string>) => {
            if (state.user) {
                state.user.token = action.payload;

                // Update user data in cookies
                const updatedUserData = { ...state.user };
                cookies.set("user", updatedUserData, { path: "/" });
            }
        },
        // Logout user and clear all authentication data
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;

            // Remove user data from cookies
            cookies.remove("user", { path: "/" });
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    setUser,
    updateToken,
    logout
} = authSlice.actions;

export default authSlice;

// Async action creator example - can be used when integrating with an API service
export const loginUser = (userData: TUser) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch(loginSuccess(userData));
            return userData;
        } catch (error) {
            dispatch(loginFailure(error instanceof Error ? error.message : "Login failed"));
            throw error;
        }
    };

// Initialize authentication by retrieving user data from cookies on app start
export const initializeAuth = () => (dispatch: AppDispatch) => {
    const userData = cookies.get("user");
    if (userData) {
        dispatch(setUser(userData));
    }
};
