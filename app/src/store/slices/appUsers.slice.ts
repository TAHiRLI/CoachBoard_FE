import {
  AppUserDto,
  CreateUserDto,
  UpdateUserDto,
} from "@/lib/types/appUser.types";
import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { appUserService } from "@/API/Services/appUser.service";

interface AppUserState {
  appUsers: AppUserDto[];
  selectedAppUser: AppUserDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppUserState = {
  appUsers: [],
  selectedAppUser: null,
  loading: false,
  error: null,
};

export const fetchAppUsers = createAsyncThunk("appUsers/fetchAll", async () => {
  const response = await appUserService.getAll();
  return response.data;
});

export const createUser = createAsyncThunk(
  "appUsers/create",
  async (dto: CreateUserDto) => {
    const response = await appUserService.create(dto);
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  "appUsers/update",
  async ({ id, dto }: { id: string; dto: UpdateUserDto }) => {
    await appUserService.update(id, dto);
    return { id, dto };
  }
);

export const deleteUser = createAsyncThunk(
  "appUsers/delete",
  async (id: string) => {
    await appUserService.delete(id);
    return id;
  }
);

const appUsersSlice = createSlice({
  name: "appUsers",
  initialState,
  reducers: {
    selectAppUser: (state, action: PayloadAction<AppUserDto>) => {
      state.selectedAppUser = action.payload;
    },
    clearAppUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppUsers.fulfilled, (state, action: PayloadAction<AppUserDto[]>) => {
        state.appUsers = action.payload;
        state.loading = false;
      })
      .addCase(fetchAppUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      });

    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<AppUserDto>) => {
        state.appUsers.push(action.payload);
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create user";
      });

    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const { id, dto } = action.payload;
        const index = state.appUsers.findIndex((u) => u.id === id);
        if (index !== -1) {
          state.appUsers[index] = { ...state.appUsers[index], ...dto };
        }
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user";
      });

    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.appUsers = state.appUsers.filter((u) => u.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
      });
  },
});

export const { selectAppUser, clearAppUserError } = appUsersSlice.actions;

export default appUsersSlice;