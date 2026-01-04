import { Tag, TagState } from "@/lib/types/tag.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { tagsService } from "@/API/Services/tags.service";

// Initial state
const initialState: TagState = {
  tags: [],
  loading: false,
  error: null,
  selectedTag: null,
};

// Async thunks
export const fetchTags = createAsyncThunk("tags/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await tagsService.getAll();
    return response.data as Tag[];
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch tags");
  }
});

export const createTag = createAsyncThunk("tags/create", async (name: string, { rejectWithValue }) => {
  try {
    const response = await tagsService.create(name);
    return response.data as Tag;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create team");
  }
});

export const deleteTag = createAsyncThunk("tags/delete", async (id: string, { rejectWithValue }) => {
  try {
    await tagsService.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete team");
  }
});

// Slice
const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    clearSelectedTag: (state) => {
      state.selectedTag = null;
    },
    clearTagError: (state) => {
      state.error = null;
    },
    selectTag: (state, action) => {
      state.selectedTag = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags.push(action.payload);
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
     
    builder
      .addCase(deleteTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = state.tags.filter((tag) => tag.id !== action.payload);
        if (state.selectedTag?.id === action.payload) {
          state.selectedTag = null;
        }
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedTag, clearTagError, selectTag } = tagsSlice.actions;
export default tagsSlice;
