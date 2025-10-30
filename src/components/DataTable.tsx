import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaCopy, FaFilter, FaTimes, FaUser, FaCode } from 'react-icons/fa';
import { authAPI, type DiscordMember } from '../api/auth';
import toast from 'react-hot-toast';
import UserDetailModal from './UserDetailModal';

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

const DataTable: React.FC = () => {
  const [discordMembers, setDiscordMembers] = useState<DiscordMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterReferrerId, setFilterReferrerId] = useState('');
  const [filterReferredId, setFilterReferredId] = useState('');
  const [filterReferrerName, setFilterReferrerName] = useState('');
  const [filterReferredName, setFilterReferredName] = useState('');
  const [filterInviteCode, setFilterInviteCode] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(['referrerName']);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isReferredNameDropdownOpen, setIsReferredNameDropdownOpen] = useState(false);
  const [isReferrerNameDropdownOpen, setIsReferrerNameDropdownOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<DiscordMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 200;
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const referredNameDropdownRef = useRef<HTMLDivElement>(null);
  const referrerNameDropdownRef = useRef<HTMLDivElement>(null);
  const hasFetchedRef = useRef(false);

  const filterOptions = [
    // { id: 'referrerId', label: 'Referrer ID', icon: FaIdCard },
    // { id: 'referredId', label: 'Referred ID', icon: FaIdCard },
    { id: 'referrerName', label: 'Referrer Name', icon: FaUser },
    { id: 'referredName', label: 'Referred Name', icon: FaUser },
    { id: 'inviteCode', label: 'Invite Code', icon: FaCode },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
      if (referredNameDropdownRef.current && !referredNameDropdownRef.current.contains(event.target as Node)) {
        setIsReferredNameDropdownOpen(false);
      }
      if (referrerNameDropdownRef.current && !referrerNameDropdownRef.current.contains(event.target as Node)) {
        setIsReferrerNameDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchDiscordMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const members = await authAPI.getDiscordMembers();
      
      // The API function now handles the response structure
      const membersArray = Array.isArray(members) ? members : [];
      setDiscordMembers(membersArray);
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to fetch Discord members');
      toast.error('Failed to load Discord members');
      setDiscordMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch members only once on mount (prevent duplicate calls in React StrictMode)
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchDiscordMembers();
    }
  }, []);

  const addFilter = (filterId: string) => {
    // Only allow one filter at a time - clear existing filter first
    if (activeFilters.length === 0) {
      setActiveFilters([filterId]);
      setIsFilterDropdownOpen(false);
    } else {
      // If a filter is already active, don't add new one
      setIsFilterDropdownOpen(false);
    }
  };

  const removeFilter = (filterId: string) => {
    // Clear all filters - only one filter at a time
    setActiveFilters([]);
    // Clear the filter value
    switch (filterId) {
      case 'referrerId':
        setFilterReferrerId('');
        break;
      case 'referredId':
        setFilterReferredId('');
        break;
      case 'referrerName':
        setFilterReferrerName('');
        break;
      case 'referredName':
        setFilterReferredName('');
        break;
      case 'inviteCode':
        setFilterInviteCode('');
        break;
    }
  };

  const getFilterValue = (filterId: string) => {
    switch (filterId) {
      case 'referrerId':
        return filterReferrerId;
      case 'referredId':
        return filterReferredId;
      case 'referrerName':
        return filterReferrerName;
      case 'referredName':
        return filterReferredName;
      case 'inviteCode':
        return filterInviteCode;
      default:
        return '';
    }
  };

  const setFilterValue = (filterId: string, value: string) => {
    switch (filterId) {
      case 'referrerId':
        setFilterReferrerId(value);
        break;
      case 'referredId':
        setFilterReferredId(value);
        break;
      case 'referrerName':
        setFilterReferrerName(value);
        break;
      case 'referredName':
        setFilterReferredName(value);
        break;
      case 'inviteCode':
        setFilterInviteCode(value);
        break;
    }
  };

  const getFilterLabel = (filterId: string) => {
    return filterOptions.find(opt => opt.id === filterId)?.label || filterId;
  };

  const getFilterIcon = (filterId: string) => {
    const option = filterOptions.find(opt => opt.id === filterId);
    return option ? option.icon : FaFilter;
  };

  // Get unique referred names from the table data
  const uniqueReferredNames = useMemo(() => {
    const names = new Set<string>();
    discordMembers.forEach(member => {
      if (member.referredName && member.referredName.trim()) {
        names.add(member.referredName);
      }
    });
    return Array.from(names).sort();
  }, [discordMembers]);

  // Get unique referrer names from the table data
  const uniqueReferrerNames = useMemo(() => {
    const names = new Set<string>();
    discordMembers.forEach(member => {
      if (member.referrerName && member.referrerName.trim()) {
        names.add(member.referrerName);
      }
    });
    return Array.from(names).sort();
  }, [discordMembers]);

  // Filter members based on referrer ID, referred ID, referrer name, referred name, and invite code
  const filteredMembers = useMemo(() => {
    // Trim filter values to remove whitespace
    const trimmedReferrerId = filterReferrerId.trim();
    const trimmedReferredId = filterReferredId.trim();
    const trimmedReferrerName = filterReferrerName.trim();
    const trimmedReferredName = filterReferredName.trim();
    const trimmedInviteCode = filterInviteCode.trim();

    // Filter all members based on active filters
    const filtered = discordMembers.filter(member => {
      // Referrer ID filter - check if matches (partial)
      if (trimmedReferrerId) {
        const referrerIdMatch = member.referrerId?.toLowerCase().includes(trimmedReferrerId.toLowerCase());
        if (!referrerIdMatch) return false;
      }
      
      // Referred ID filter - check if matches (partial)
      if (trimmedReferredId) {
        const referredIdMatch = member.referredId?.toLowerCase().includes(trimmedReferredId.toLowerCase());
        if (!referredIdMatch) return false;
      }
      
      // Referrer Name filter - check if matches (exact)
      if (trimmedReferrerName) {
        const memberReferrerName = member.referrerName?.trim().toLowerCase();
        const filterReferrerNameLower = trimmedReferrerName.toLowerCase();
        const referrerNameMatch = memberReferrerName === filterReferrerNameLower;
        if (!referrerNameMatch) return false;
      }
      
      // Referred Name filter - check if matches (exact)
      if (trimmedReferredName) {
        const memberReferredName = member.referredName?.trim().toLowerCase();
        const filterReferredNameLower = trimmedReferredName.toLowerCase();
        const referredNameMatch = memberReferredName === filterReferredNameLower;
        if (!referredNameMatch) return false;
      }
      
      // Invite Code filter - check if matches (partial)
      if (trimmedInviteCode) {
        const inviteCodeMatch = member.inviteCode?.toLowerCase().includes(trimmedInviteCode.toLowerCase());
        if (!inviteCodeMatch) return false;
      }
      
      // If all active filters match, include this member
      return true;
    });

    return filtered;
  }, [discordMembers, filterReferrerId, filterReferredId, filterReferrerName, filterReferredName, filterInviteCode]);

  const totalItems = filteredMembers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredMembers.slice(startIndex, endIndex);


  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterReferrerId, filterReferredId, filterReferrerName, filterReferredName, filterInviteCode]);

  // Sync activeFilters with filter values
  useEffect(() => {
    const newActiveFilters: string[] = [];
    if (filterReferrerId) newActiveFilters.push('referrerId');
    if (filterReferredId) newActiveFilters.push('referredId');
    if (filterReferrerName || true) newActiveFilters.push('referrerName'); // Always show referrerName filter
    if (filterReferredName) newActiveFilters.push('referredName');
    if (filterInviteCode) newActiveFilters.push('inviteCode');
    
    setActiveFilters(newActiveFilters);
  }, [filterReferrerId, filterReferredId, filterReferrerName, filterReferredName, filterInviteCode]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (member: DiscordMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
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
            onClick={() => {
              hasFetchedRef.current = false;
              fetchDiscordMembers();
            }}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show message if no data loaded at all (not due to filtering)
  const hasNoData = !loading && discordMembers.length === 0 && !filterReferrerId && !filterReferredId && !filterReferrerName && !filterReferredName && !filterInviteCode;
  
  if (hasNoData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No data available</p>
          <button
            onClick={() => {
              hasFetchedRef.current = false;
              fetchDiscordMembers();
            }}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Filter Section */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 relative z-10">
          <div className="flex flex-wrap items-center gap-4">
            {/* Add Filter Dropdown Button */}
            {false && (
            <div className="relative flex-shrink-0" ref={filterDropdownRef}>
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors shadow-sm"
              >
                <FaFilter className="h-4 w-4 mr-2" />
                Add Filter
              </button>

              {/* Dropdown Menu */}
              {isFilterDropdownOpen && (
                <div className="absolute z-[60] mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Available Filters
                  </div>
                  {filterOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = activeFilters.includes(option.id);
                    const hasActiveFilter = activeFilters.length > 0;
                    return (
                      <button
                        key={option.id}
                        onClick={() => !hasActiveFilter && addFilter(option.id)}
                        disabled={isActive || hasActiveFilter}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center space-x-3 transition-colors ${
                          isActive || hasActiveFilter
                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`h-4 w-4 flex-shrink-0 ${isActive || hasActiveFilter ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className="flex-1">{option.label}</span>
                        {isActive && (
                          <span className="ml-auto text-xs text-gray-400 flex-shrink-0">Active</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            )}

            {/* Active Filter Inputs */}
            {activeFilters.length > 0 && (
              <div className="flex-1 flex flex-wrap gap-4 items-end">
                {activeFilters.map((filterId) => {
                  const Icon = getFilterIcon(filterId);
                  const label = getFilterLabel(filterId);
                  const filterValue = getFilterValue(filterId);
                  
                  // Special rendering for Referred Name filter with dropdown
                  if (filterId === 'referredName') {
                    // Filter names based on input
                    const filteredReferredNames = uniqueReferredNames.filter(name =>
                      name.toLowerCase().includes(filterValue.toLowerCase())
                    );

                    return (
                      <div key={filterId} className="flex-1 min-w-[200px] max-w-[280px]">
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
                        <div className="relative" ref={referredNameDropdownRef}>
                          <input
                            type="text"
                            value={filterValue}
                            onChange={(e) => {
                              setFilterValue(filterId, e.target.value);
                              setIsReferredNameDropdownOpen(true);
                            }}
                            onFocus={() => setIsReferredNameDropdownOpen(true)}
                            placeholder={`Type to search ${label.toLowerCase()}...`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm transition-all"
                          />
                          {isReferredNameDropdownOpen && filteredReferredNames.length > 0 && (
                            <div className="absolute z-[70] mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                              {filteredReferredNames.map((name) => (
                                <button
                                  key={name}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFilterValue(filterId, name);
                                    setIsReferredNameDropdownOpen(false);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                                >
                                  {name}
                                </button>
                              ))}
                            </div>
                          )}
                          {isReferredNameDropdownOpen && filteredReferredNames.length === 0 && uniqueReferredNames.length > 0 && (
                            <div className="absolute z-[70] mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No matches found
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Special rendering for Referrer Name filter with dropdown
                  if (filterId === 'referrerName') {
                    // Filter names based on input
                    const filteredReferrerNames = uniqueReferrerNames.filter(name =>
                      name.toLowerCase().includes(filterValue.toLowerCase())
                    );

                    return (
                      <div key={filterId} className="flex-1 min-w-[200px] max-w-[280px]">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <Icon className="h-3.5 w-3.5 mr-1.5 text-gray-500 flex-shrink-0" />
                            <span>{label}</span>
                          </label>
                        </div>
                        <div className="relative" ref={referrerNameDropdownRef}>
                          <input
                            type="text"
                            value={filterValue}
                            onChange={(e) => {
                              setFilterValue(filterId, e.target.value);
                              setIsReferrerNameDropdownOpen(true);
                            }}
                            onFocus={() => setIsReferrerNameDropdownOpen(true)}
                            placeholder={`Type to search ${label.toLowerCase()}...`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm transition-all"
                          />
                          {isReferrerNameDropdownOpen && filteredReferrerNames.length > 0 && (
                            <div className="absolute z-[70] mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                              {filteredReferrerNames.map((name) => (
                                <button
                                  key={name}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFilterValue(filterId, name);
                                    setIsReferrerNameDropdownOpen(false);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                                >
                                  {name}
                                </button>
                              ))}
                            </div>
                          )}
                          {isReferrerNameDropdownOpen && filteredReferrerNames.length === 0 && uniqueReferrerNames.length > 0 && (
                            <div className="absolute z-[70] mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No matches found
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  
                  // Regular input for other filters
                  return (
                    <div key={filterId} className="flex-1 min-w-[200px] max-w-[280px]">
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

            {/* Clear All Filters Button */}
            {false && activeFilters.length > 0 && (
              <button
                onClick={() => {
                  setActiveFilters([]);
                  setFilterReferrerId('');
                  setFilterReferredId('');
                  setFilterReferrerName('');
                  setFilterReferredName('');
                  setFilterInviteCode('');
                }}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors shadow-sm flex-shrink-0 h-[42px] flex items-center justify-center"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto" style={{ zIndex: 1 }}>
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Referrer ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[13%]">
                  Referrer Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[13%]">
                  Referred Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Referred ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[13%]">
                  Invite Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                  Invite URL
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[17%]">
                  Joined Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    No results found matching your filters. Try adjusting your search criteria.
                  </td>
                </tr>
              ) : (
                currentItems.map((member, index) => (
                  <tr 
                    key={`${member?.referrerId}-${member?.referredId}-${index}`} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(member)}
                  >
                    <td className="px-4 py-4 align-middle">
                      <Tooltip text={member?.referrerId || 'Unknown Referrer ID'}>
                        <span className="text-sm text-gray-500 font-mono cursor-help inline-block">
                          {member?.referrerId ? member.referrerId.substring(0, 8) + '...' : 'N/A'}
                        </span>
                      </Tooltip>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <Tooltip text={`Referrer: ${member?.referrerName || 'Unknown'}`}>
                        <span className="text-sm font-medium text-gray-900 cursor-help inline-block">
                          {member?.referrerName || 'Unknown'}
                        </span>
                      </Tooltip>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <Tooltip text={`Referred: ${member?.referredName || 'Unknown'}`}>
                        <span className="text-sm font-medium text-gray-900 cursor-help inline-block">
                          {member?.referredName || 'Unknown'}
                        </span>
                      </Tooltip>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <Tooltip text={member?.referredId || 'Unknown Referred ID'}>
                        <span className="text-sm text-gray-500 font-mono cursor-help inline-block">
                          {member?.referredId ? member.referredId.substring(0, 8) + '...' : 'N/A'}
                        </span>
                      </Tooltip>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <Tooltip text={member?.inviteCode || 'No invite code'}>
                        <div className="flex items-center space-x-2 cursor-help" onClick={(e) => e.stopPropagation()}>
                          {member?.inviteCode ? (
                            <>
                              <span className="text-sm font-mono text-gray-900 truncate">
                                {member.inviteCode}
                              </span>
                              <button
                                onClick={() => copyToClipboard(member.inviteCode!)}
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
                      <Tooltip text={member?.inviteUrl || 'No invite URL'}>
                        <div className="flex items-center space-x-2 cursor-help" onClick={(e) => e.stopPropagation()}>
                          {member?.inviteUrl ? (
                            <>
                              <span className="text-sm font-mono text-gray-900 truncate">
                                {member.inviteUrl}
                              </span>
                              <button
                                onClick={() => copyToClipboard(member.inviteUrl!)}
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
                      <Tooltip text={`Joined: ${member?.joinedDate ? formatDate(member.joinedDate) : 'Unknown'}`}>
                        <span className="text-sm text-gray-500 cursor-help inline-block">
                          {member?.joinedDate ? formatDate(member.joinedDate) : 'N/A'}
                        </span>
                      </Tooltip>
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

      {/* User Detail Modal */}
      <UserDetailModal 
        member={selectedMember} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
};

export default DataTable;