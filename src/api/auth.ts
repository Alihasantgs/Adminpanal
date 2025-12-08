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

export interface ReferralStatistics {
  userId: string;
  discordUsername: string;
  totalInvitesCreated: number;
  generalInvitesCreated: number;
  personalInvitesCreated: number;
  joinedViaInvites: number;
  lastUpdated: string;
}

export interface DiscordInvite {
  id: string;
  inviteCode: string;
  inviteUrl: string;
  inviteType: string;
  targetUsername?: string | null;
  createdAt: string;
  creator: {
    id: string;
    discordId: string;
    discordUsername: string;
  };
  expiresAt?: string | null;
  isPermanent: boolean;
  maxUses?: number | null;
  totalJoins: number;
  joinEvents: Array<{
    id: string;
    joinerId: string;
    joinerUsername: string;
    joinedAt: string;
  }>;
  tracking: Array<{
    id: string;
    targetDiscordUsername: string;
    type: string;
    status: string;
    sentAt: string;
    expiresAt?: string | null;
    joinedAt?: string | null;
    reminderSentAt?: string | null;
    referrer: {
      id: string;
      discordId: string;
      discordUsername: string;
    };
  }>;
  isValid: boolean;
  validationError?: string | null;
  discordData: {
    code: string;
    url: string;
    uses: number;
    maxUses: number;
    maxAge: number;
    createdAt: string;
    expiresAt?: string | null;
    temporary: boolean;
    inviter: {
      id: string;
      username: string;
      discriminator: string;
    };
    channel: {
      id: string;
      name: string;
      type: number;
    };
  };
  maxAge?: number | null;
  uses: number;
  status: string;
  timeUntilExpiry?: string | null;
  timeUntilExpiryFormatted?: string | null;
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
  },

  getReferralStatistics: async (referrerId: string): Promise<ReferralStatistics> => {
    try {
      const response = await api.get(`/api/v1/referrals/statistics/${referrerId}`, {
        // params: {
        //   inviteCode: inviteCode
        // }
      });
      // Handle the API response structure: {success: true, data: {...}, message: "..."}
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      // Fallback if response structure is different
      return response.data || {};
    } catch (error: any) {
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch referral statistics'
      } as ApiError;
    }
  },

  getDiscordInvites: async (status?: string, expiryType?: string): Promise<DiscordInvite[]> => {
    try {
      const params: Record<string, string> = {};
      if (status) params.status = status;
      if (expiryType) params.expiryType = expiryType;

      const response = await api.get('/api/v1/discord/invites', { params });
      // Handle the API response structure: {success: true, invites: [...], summary: {...}, filters: {...}}
      if (response.data && response.data.success && Array.isArray(response.data.invites)) {
        return response.data.invites;
      }
      // Fallback if response structure is different
      return response.data?.invites || response.data || [];
    } catch (error: any) {
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch Discord invites'
      } as ApiError;
    }
  }
};
