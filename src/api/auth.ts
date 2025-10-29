import api from './axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    access_token: string;
    user: {
      id: string;
      discordId?: string;
      email: string;
      discordUsername?: string;
      avatar?: string;
      joinedAt?: string;
    };
  };
  timestamp?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface DiscordMember {
  referrerId: string;
  referrerName: string;
  referredId: string;
  referredName: string;
  inviteCode: string;
  inviteUrl: string;
  joinedDate: string;
}

// Auth API functions
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post('/api/v1/auth/login', credentials);
      // Handle nested response structure: {success, message, data: {access_token, user}}
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
  },

  getDiscordMembers: async (): Promise<DiscordMember[]> => {
    try {
      const response = await api.get('/api/v1/members/discord-members');
      // Handle the API response structure: {success: true, data: [...], message: "..."}
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      // Fallback if response structure is different
      return response.data || [];
    } catch (error: any) {
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch Discord members'
      } as ApiError;
    }
  }
};
