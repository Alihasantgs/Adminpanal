import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaCopy, FaTimes, FaCode } from 'react-icons/fa';
import { useInvites } from '../context/InviteContext';
import toast from 'react-hot-toast';
import type { DiscordInvite } from '../api/auth';

// Helper function to copy text to clipboard
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  } catch (err) {
    toast.error('Failed to copy');
  }
};

// Helper function to format date
const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Custom Tooltip Component
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

const InviteTable: React.FC = () => {
  const { invites, loading, error, refreshInvites, fetchInvites } = useInvites();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterInviteCode, setFilterInviteCode] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterExpiryType, setFilterExpiryType] = useState<string>('all');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const itemsPerPage = 200;
  const hasInitialFetchRef = useRef(false);

  const removeFilter = (filterId: string) => {
    setActiveFilters([]);
    switch (filterId) {
      case 'inviteCode':
        setFilterInviteCode('');
        break;
    }
  };

  const getFilterValue = (filterId: string) => {
    switch (filterId) {
      case 'inviteCode':
        return filterInviteCode;
      default:
        return '';
    }
  };

  const setFilterValue = (filterId: string, value: string) => {
    switch (filterId) {
      case 'inviteCode':
        setFilterInviteCode(value);
        break;
    }
  };

  const getFilterLabel = (filterId: string) => {
    if (filterId === 'inviteCode') return 'Invite Code';
    return filterId;
  };

  const getFilterIcon = (filterId: string) => {
    if (filterId === 'inviteCode') return FaCode;
    return FaCode;
  };

  // Filter invites based on invite code
  const filteredInvites = useMemo(() => {
    const trimmedInviteCode = filterInviteCode.trim();

    const filtered = invites.filter((invite: DiscordInvite) => {
      // Invite Code filter - check if matches (partial)
      if (trimmedInviteCode) {
        const inviteCode = invite.inviteCode?.toLowerCase() || '';
        const inviteCodeMatch = inviteCode.includes(trimmedInviteCode.toLowerCase());
        if (!inviteCodeMatch) return false;
      }
      
      return true;
    });

    return filtered;
  }, [invites, filterInviteCode]);

  const totalItems = filteredInvites.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredInvites.slice(startIndex, endIndex);

  // Fetch invites when status or expiryType filter changes (skip initial mount)
  useEffect(() => {
    // Skip the first render to avoid duplicate call with context's initial fetch
    if (!hasInitialFetchRef.current) {
      hasInitialFetchRef.current = true;
      return;
    }
    fetchInvites(filterStatus, filterExpiryType);
  }, [filterStatus, filterExpiryType, fetchInvites]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterInviteCode, filterStatus, filterExpiryType]);

  // Sync activeFilters with filter values
  useEffect(() => {
    const newActiveFilters: string[] = [];
    if (filterInviteCode) newActiveFilters.push('inviteCode');
    
    setActiveFilters(newActiveFilters);
  }, [filterInviteCode]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            currentPage === i ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refreshInvites}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show message if no data loaded at all (not due to filtering)
  const hasNoData = !loading && invites.length === 0 && !filterInviteCode;
  
  if (hasNoData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No invite data available</p>
          <button
            onClick={refreshInvites}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filter Section */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 relative z-10">
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Filter Dropdown */}
          <div className="flex-1 min-w-[180px] max-w-[220px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm transition-all bg-white"
            >
              <option value="all">All</option>
              <option value="valid">Valid</option>
              <option value="invalid">Invalid</option>
            </select>
          </div>

          {/* Expiry Type Filter Dropdown */}
          <div className="flex-1 min-w-[180px] max-w-[220px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Type
            </label>
            <select
              value={filterExpiryType}
              onChange={(e) => setFilterExpiryType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm transition-all bg-white"
            >
              <option value="all">All</option>
              <option value="permanent">Permanent</option>
              <option value="expiring">Expiring</option>
            </select>
          </div>

          {/* Invite Code Filter Input */}
          {activeFilters.length > 0 && (
            <div className="flex-1 min-w-[200px] max-w-[280px]">
              {activeFilters.map((filterId) => {
                const Icon = getFilterIcon(filterId);
                const label = getFilterLabel(filterId);
                const filterValue = getFilterValue(filterId);
                
                return (
                  <div key={filterId}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <Icon className="h-3.5 w-3.5 mr-1.5 text-gray-500 flex-shrink-0" />
                        <span>{label}</span>
                      </label>
                      <button
                        onClick={() => removeFilter(filterId)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100 flex-shrink-0"
                        title="Remove filter"
                      >
                        <FaTimes className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={filterValue}
                      onChange={(e) => setFilterValue(filterId, e.target.value)}
                      placeholder={`Enter ${label.toLowerCase()}...`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm transition-all"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" style={{ zIndex: 1 }}>
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                Invite Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">
                Invite URL
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                Inviter
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                Uses
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                Expires At
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                  No results found matching your filters. Try adjusting your search criteria.
                </td>
              </tr>
            ) : (
              currentItems.map((invite: DiscordInvite, index: number) => (
                <tr 
                  key={`${invite?.id}-${index}`} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 align-middle">
                    <Tooltip text={invite?.inviteCode || 'No invite code'}>
                      <div className="flex items-center space-x-2 cursor-help">
                        {invite?.inviteCode ? (
                          <>
                            <span className="text-sm font-mono text-gray-900 truncate">
                              {invite.inviteCode}
                            </span>
                            <button
                              onClick={() => copyToClipboard(invite.inviteCode!)}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded flex-shrink-0"
                              title="Copy invite code"
                            >
                              <FaCopy className="h-3 w-3" />
                            </button>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </div>
                    </Tooltip>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <Tooltip text={invite?.inviteUrl || 'No invite URL'}>
                      <div className="flex items-center space-x-2 cursor-help">
                        {invite?.inviteUrl ? (
                          <>
                            <span className="text-sm font-mono text-gray-900 truncate">
                              {invite.inviteUrl}
                            </span>
                            <button
                              onClick={() => copyToClipboard(invite.inviteUrl!)}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded flex-shrink-0"
                              title="Copy invite URL"
                            >
                              <FaCopy className="h-3 w-3" />
                            </button>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </div>
                    </Tooltip>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <Tooltip text={invite?.creator?.discordUsername || 'Unknown'}>
                      <span className="text-sm font-medium text-gray-900 cursor-help inline-block">
                        {invite?.creator?.discordUsername || 'Unknown'}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <span className="text-sm text-gray-500">
                      {invite?.uses !== undefined ? `${invite.uses}${invite?.maxUses ? ` / ${invite.maxUses}` : ''}` : 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <Tooltip text={invite?.timeUntilExpiryFormatted || (invite?.expiresAt ? formatDate(invite.expiresAt) : 'Never expires')}>
                      <span className="text-sm text-gray-500 cursor-help inline-block">
                        {invite?.timeUntilExpiryFormatted || (invite?.expiresAt ? formatDate(invite.expiresAt) : 'Never')}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      invite?.status === 'VALID' 
                        ? 'bg-green-100 text-green-800' 
                        : invite?.status === 'INVALID' || invite?.status === 'EXPIRED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {invite?.status || 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div className="flex-1 flex justify-between sm:justify-end">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft className="h-4 w-4 mr-2" /> Previous
          </button>
          <div className="hidden md:flex items-center space-x-2 ml-4">
            {renderPagination()}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <FaChevronRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default InviteTable;
