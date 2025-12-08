import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { authAPI, type DiscordInvite, type ApiError } from '../api/auth';

interface InviteContextType {
  invites: DiscordInvite[];
  loading: boolean;
  error: string | null;
  fetchInvites: (status?: string, expiryType?: string) => Promise<void>;
  refreshInvites: () => Promise<void>;
}

const InviteContext = createContext<InviteContextType | undefined>(undefined);

export const useInvites = () => {
  const context = useContext(InviteContext);
  if (context === undefined) {
    throw new Error('useInvites must be used within an InviteProvider');
  }
  return context;
};

interface InviteProviderProps {
  children: ReactNode;
}

export const InviteProvider: React.FC<InviteProviderProps> = ({ children }) => {
  const [invites, setInvites] = useState<DiscordInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastStatus, setLastStatus] = useState<string>('all');
  const [lastExpiryType, setLastExpiryType] = useState<string>('all');
  const hasFetchedRef = React.useRef(false);

  const fetchInvites = useCallback(async (status?: string, expiryType?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const inviteStatus = status || 'all';
      const inviteExpiryType = expiryType || 'all';
      
      setLastStatus(inviteStatus);
      setLastExpiryType(inviteExpiryType);
      
      const data = await authAPI.getDiscordInvites(inviteStatus, inviteExpiryType);
      setInvites(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to fetch invites';
      setError(errorMessage);
      setInvites([]);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshInvites = useCallback(async () => {
    hasFetchedRef.current = false;
    await fetchInvites(lastStatus, lastExpiryType);
  }, [fetchInvites, lastStatus, lastExpiryType]);

  // Fetch invites on mount with default parameters (prevent duplicate calls in React StrictMode)
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchInvites('all', 'all');
    }
  }, [fetchInvites]);

  const value: InviteContextType = {
    invites,
    loading,
    error,
    fetchInvites,
    refreshInvites
  };

  return (
    <InviteContext.Provider value={value}>
      {children}
    </InviteContext.Provider>
  );
};

