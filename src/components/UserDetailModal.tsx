import React, { useState, useEffect } from 'react';
import { FaTimes, FaCopy, FaUser, FaIdCard, FaCode, FaLink, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import { type DiscordMember, authAPI, type ReferralStatistics } from '../api/auth';
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

interface UserDetailModalProps {
  member: DiscordMember | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ member, isOpen, onClose }) => {
  const [statistics, setStatistics] = useState<ReferralStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    if (!member?.referrerId || !member?.inviteCode) return;
    
    try {
      setLoading(true);
      setError(null);
      const stats = await authAPI.getReferralStatistics(member.referrerId);
      setStatistics(stats);
      console.log('Referral Statistics:', stats);
    } catch (err: any) {
      console.error('Failed to fetch statistics:', err);
      setError(err.message || 'Failed to load statistics');
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && member) {
      fetchStatistics();
    } else {
      // Reset state when modal closes
      setStatistics(null);
      setError(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, member]);

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-4">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="relative bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-3xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-gray-800 px-6 py-5 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <FaUser className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  User Details
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Content - Scrollable */}
          <div className="bg-gray-50 px-6 py-6 overflow-y-auto flex-1">
            <div className="space-y-6">
                 {/* Statistics Section */}
                 <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <FaChartBar className="h-4 w-4 mr-2 text-gray-500" />
                  Referral Statistics
                </h4>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-4 text-red-600 text-sm">
                    {error}
                  </div>
                ) : statistics ? (
                  <div className="space-y-4">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-100 p-2 rounded-lg mr-2">
                            <FaChartBar className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-xs font-medium text-gray-600">Total Referrals</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{statistics.totalReferrals}</div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center mb-2">
                          <div className="bg-green-100 p-2 rounded-lg mr-2">
                            <FaLink className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-xs font-medium text-gray-600">General Invites</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">{statistics.joinedViaGeneralInvites}</div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center mb-2">
                          <div className="bg-purple-100 p-2 rounded-lg mr-2">
                            <FaUser className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="text-xs font-medium text-gray-600">Personal Referrals</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">{statistics.joinedViaPersonalReferrals}</div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">Discord Username</span>
                        <span className="text-sm font-semibold text-gray-900">{statistics.discordUsername}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-600">Last Updated</span>
                        <span className="text-sm text-gray-700">{statistics.lastUpdated ? formatDate(statistics.lastUpdated) : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No statistics available
                  </div>
                )}
              </div>
              {/* Referrer Section */}
              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <FaIdCard className="h-4 w-4 mr-2 text-gray-500" />
                  Referrer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Referrer ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={member.referrerId || 'N/A'}
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-900 focus:outline-none cursor-not-allowed pr-10"
                      />
                      <button
                        onClick={() => copyToClipboard(member.referrerId || '')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Copy Referrer ID"
                      >
                        <FaCopy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Referrer Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={member.referrerName || 'N/A'}
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none cursor-not-allowed pr-10"
                      />
                      <button
                        onClick={() => copyToClipboard(member.referrerName || '')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Copy Referrer Name"
                      >
                        <FaCopy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referred Section */}
              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <FaUser className="h-4 w-4 mr-2 text-gray-500" />
                  Referred Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Referred ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={member.referredId || 'N/A'}
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-900 focus:outline-none cursor-not-allowed pr-10"
                      />
                      <button
                        onClick={() => copyToClipboard(member.referredId || '')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Copy Referred ID"
                      >
                        <FaCopy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Referred Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={member.referredName || 'N/A'}
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none cursor-not-allowed pr-10"
                      />
                      <button
                        onClick={() => copyToClipboard(member.referredName || '')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Copy Referred Name"
                      >
                        <FaCopy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invite Section */}
              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <FaLink className="h-4 w-4 mr-2 text-gray-500" />
                  Invite Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      <FaCode className="inline h-3 w-3 mr-1" />
                      Invite Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={member.inviteCode || 'N/A'}
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-900 focus:outline-none cursor-not-allowed pr-10"
                      />
                      <button
                        onClick={() => copyToClipboard(member.inviteCode || '')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Copy Invite Code"
                      >
                        <FaCopy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      <FaLink className="inline h-3 w-3 mr-1" />
                      Invite URL
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={member.inviteUrl || 'N/A'}
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none cursor-not-allowed pr-10 break-all"
                      />
                      <button
                        onClick={() => copyToClipboard(member.inviteUrl || '')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Copy Invite URL"
                      >
                        <FaCopy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Section */}
              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <FaCalendarAlt className="h-4 w-4 mr-2 text-gray-500" />
                  Join Information
                </h4>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Joined Date
                  </label>
                  <input
                    type="text"
                    value={member.joinedDate ? formatDate(member.joinedDate) : 'N/A'}
                    disabled
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>

           
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;

