import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCopy } from 'react-icons/fa';
import { authAPI, type DiscordMember } from '../api/auth';
import toast from 'react-hot-toast';

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
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDiscordMembers();
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

  const totalItems = Array.isArray(discordMembers) ? discordMembers.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = Array.isArray(discordMembers) ? discordMembers.slice(startIndex, endIndex) : [];

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
            onClick={fetchDiscordMembers}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Debug: Show data info when no items
  if (!loading && totalItems === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No data available</p>
          <p className="text-sm text-gray-500 mb-4">
            Debug info: {discordMembers ? 'Data exists' : 'No data'} | 
            Type: {typeof discordMembers} | 
            Is Array: {Array.isArray(discordMembers) ? 'Yes' : 'No'}
          </p>
          <button
            onClick={fetchDiscordMembers}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referrer ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referrer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referred Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invite Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invite URL
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((member, index) => (
              <tr key={member?.referrerId || `member-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Tooltip text={member?.referrerId || 'Unknown Referrer ID'}>
                    <span className="text-sm text-gray-500 font-mono cursor-help">
                      {member?.referrerId ? member.referrerId.substring(0, 8) + '...' : 'N/A'}
                    </span>
                  </Tooltip>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Tooltip text={`Referrer: ${member?.referrerName || 'Unknown'}`}>
                    <span className="text-sm font-medium text-gray-900 cursor-help">
                      {member?.referrerName || 'Unknown'}
                    </span>
                  </Tooltip>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Tooltip text={`Referred: ${member?.referredName || 'Unknown'}`}>
                    <span className="text-sm font-medium text-gray-900 cursor-help">
                      {member?.referredName || 'Unknown'}
                    </span>
                  </Tooltip>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Tooltip text={`Joined: ${member?.joinedDate ? formatDate(member.joinedDate) : 'Unknown'}`}>
                    <span className="text-sm text-gray-500 cursor-help">
                      {member?.joinedDate ? formatDate(member.joinedDate) : 'N/A'}
                    </span>
                  </Tooltip>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Tooltip text={member?.inviteCode || 'No invite code'}>
                    <div className="flex items-center space-x-2 cursor-help">
                      {member?.inviteCode ? (
                        <>
                          <span className="text-sm font-mono text-gray-900">
                            {member.inviteCode}
                          </span>
                          <button
                            onClick={() => copyToClipboard(member.inviteCode!)}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded"
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <Tooltip text={member?.inviteUrl || 'No invite URL'}>
                    <div className="flex items-center space-x-2 cursor-help">
                      {member?.inviteUrl ? (
                        <>
                          <span className="text-sm font-mono text-gray-900 truncate max-w-xs">
                            {member.inviteUrl}
                          </span>
                          <button
                            onClick={() => copyToClipboard(member.inviteUrl!)}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded"
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
              </tr>
            ))}
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

export default DataTable;