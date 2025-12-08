import React from 'react';
import InviteTable from '../components/InviteTable';
import ErrorBoundary from '../components/ErrorBoundary';

const InviteTablePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Invite Table</h1>
        <p className="text-gray-600">Manage and view all invite codes and their usage.</p>
      </div>

      {/* Invite Table */}
      <ErrorBoundary>
        <InviteTable />
      </ErrorBoundary>
    </div>
  );
};

export default InviteTablePage;

