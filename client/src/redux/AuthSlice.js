import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, verifyUser } from '../services/ApiEndpoint';

export const updateUser = createAsyncThunk('updateuser', async () => {
  try {    
    const response = await verifyUser();
    return response;
  } catch (error) {
    throw error;
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    // Here you can add any API call to logout if needed
    // For example: await logoutAPI();
    
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
  loading: null,
  error: null,
  user: null
};

const AuthSlice = createSlice({
  name: "Auth",
  initialState: initialState,
  reducers: {
    SetUser: (state, action) => {
      state.user = action.payload;
    },
    Logout: (state) => {
      state.user = null;
      state.loading = null;
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = null;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = null;
        state.error = action.error.message;
        state.user = null;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = null;
        state.error = action.error.message;
      });
  }
});

export const { SetUser, Logout } = AuthSlice.actions;

export default AuthSlice.reducer;