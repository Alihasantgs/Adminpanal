import api from './axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    discordId?: string;
    email: string;
    discordUsername?: string;
    avatar?: string;
    joinedAt?: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Auth API functions
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post('/api/v1/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      throw {
        success: false,
        message: errorMessage,
        errors: error.response?.data?.errors || {}
      } as ApiError;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/api/v1/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/api/v1/auth/profile');
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to get profile'
      } as ApiError;
    }
  }
};
