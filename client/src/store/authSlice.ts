import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isInitialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  isInitialized: false,
  error: null,
};

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const data = await authService.getMe();
    return data.user;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Not authenticated');
  }
});

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data.data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    formData: { name: string; email: string; password: string; phone?: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await authService.register(formData);
      return data.data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Check Auth
    builder.addCase(checkAuth.pending, (_state) => {
      // Do not block UI navigation on background check
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.loading = false;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
