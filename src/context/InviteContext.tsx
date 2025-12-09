import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { authAPI, type DiscordInvite, type ApiError } from '../api/auth';

interface PaginationInfo {
  offset: number;
  limit: number;
  total: number;
  returned: number;
  hasMore: boolean;
  nextOffset: number;
}

interface InviteContextType {
  invites: DiscordInvite[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  fetchInvites: (status?: string, expiryType?: string, offset?: number, limit?: number) => Promise<void>;
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
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastStatus, setLastStatus] = useState<string>('all');
  const [lastExpiryType, setLastExpiryType] = useState<string>('all');
  const [lastOffset, setLastOffset] = useState<number>(0);
  const [lastLimit, setLastLimit] = useState<number>(50);
  const hasFetchedRef = React.useRef(false);

  const fetchInvites = useCallback(async (status?: string, expiryType?: string, offset?: number, limit?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const inviteStatus = status || 'all';
      const inviteExpiryType = expiryType || 'all';
      const inviteOffset = offset !== undefined ? offset : 0;
      const inviteLimit = limit !== undefined ? limit : 50;
      
      setLastStatus(inviteStatus);
      setLastExpiryType(inviteExpiryType);
      setLastOffset(inviteOffset);
      setLastLimit(inviteLimit);
      
      const result = await authAPI.getDiscordInvites(inviteStatus, inviteExpiryType, inviteOffset, inviteLimit);
      setInvites(Array.isArray(result.invites) ? result.invites : []);
      setPagination(result.pagination || null);
    } catch (err: any) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to fetch invites';
      setError(errorMessage);
      setInvites([]);
      setPagination(null);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshInvites = useCallback(async () => {
    hasFetchedRef.current = false;
    await fetchInvites(lastStatus, lastExpiryType, lastOffset, lastLimit);
  }, [fetchInvites, lastStatus, lastExpiryType, lastOffset, lastLimit]);

  // Fetch invites on mount with default parameters (prevent duplicate calls in React StrictMode)
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchInvites('all', 'all', 0, 50);
    }
  }, [fetchInvites]);

  const value: InviteContextType = {
    invites,
    pagination,
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

