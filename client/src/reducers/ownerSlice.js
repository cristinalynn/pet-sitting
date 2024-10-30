// src/store/ownerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk for user login
export const loginOwner = createAsyncThunk('owner/login', async (values, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      const data = await response.json();
      return rejectWithValue(data);
    }
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Thunk for owner signup
export const signup = createAsyncThunk('owner/signup', async (values, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      const data = await response.json();
      return rejectWithValue(data);
    }
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Thunk for checking the current session
export const fetchCurrentOwner = createAsyncThunk('owner/fetchCurrentOwner', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/check_session');
    if (!response.ok) {
      throw new Error('Not authenticated');
    }
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateOwnerProfile = createAsyncThunk('owners/updateProfile', async (ownerData, { getState, rejectWithValue }) => {
    const { owner } = getState().owners;
    try {
      const response = await fetch(`/api/current_user/${owner.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ownerData),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });

export const logoutOwner = createAsyncThunk('owners/logout', async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to logout');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });

const ownerSlice = createSlice({
  name: 'owner',
  initialState: {
    owner: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.owner = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginOwner.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.owner = action.payload;
        state.error = null;
      })
      .addCase(loginOwner.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.owner = action.payload;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchCurrentOwner.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.owner = action.payload;
      })
      .addCase(fetchCurrentOwner.rejected, (state) => {
        state.status = 'idle';
        state.owner = null;
      })
      .addCase(logoutOwner.fulfilled, (state) => {
        state.owner = null;
        state.status = 'succeeded';
      })
      .addCase(logoutOwner.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateOwnerProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(updateOwnerProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = ownerSlice.actions;

export const selectOwner = (state) => state.owner.owner;
export const selectStatus = (state) => state.owner.status;
export const selectError = (state) => state.owner.error;

export default ownerSlice.reducer;
