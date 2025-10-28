import React from 'react';
import DataTable from '../components/DataTable';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, Admin!</h1>
        <p className="text-gray-600">Here's what's happening with your business today.</p>
      </div>

      {/* Data Table */}
      <DataTable />
    </div>
  );
};

export default Dashboard;
