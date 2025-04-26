import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create an async thunk for checking authentication status
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { isAuthenticated: false };
      }
      
      // You can create a simple endpoint on your backend to verify the token
      const response = await axios.get('http://localhost:5000/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return { isAuthenticated: true };
    } catch (error) {
      return rejectWithValue({ isAuthenticated: false });
    }
  }
);

// Keep the existing fetchUserProfile thunk
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get('http://localhost:5000/api/user-profile/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    // Clear any stored tokens or user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Dispatch the Logout action to clear the state
    dispatch(Logout());
  } catch (error) {
    throw error;
  }
});

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: localStorage.getItem('token'),
  isLoading: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    SetUser: (state, action) => {
      state.user = action.payload;
    },
    Logout: (state) => {
      state.user = null;
      state.loading = null;
      state.error = null;
      state.token = null;
      state.isLoading = false;
      state.isAuthenticated = false;
    },
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      // If there's verification status in the payload, update it
      if (action.payload.user && action.payload.user.clientVerification) {
        state.user.clientVerification = action.payload.user.clientVerification;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        // Update the user status based on the clientVerification field
        if (state.user.role === 'client' && state.user.clientVerification) {
          state.user.verificationStatus = state.user.clientVerification.status;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = null;
        state.error = null;
        state.token = null;
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = null;
        state.error = action.payload;
      });
  }
});

export const { SetUser, Logout, login } = AuthSlice.actions;

export default AuthSlice.reducer;