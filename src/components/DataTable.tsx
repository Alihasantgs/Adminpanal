import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface User {
  id: string;
  name: string;
  userId: string;
  status: string;
  assignedTo: string;
  avatar: string;
}

const DataTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const users: User[] = [
    { id: '1', name: 'Robert Fox', userId: '4915500c', status: 'Added on 17 July, 2023', assignedTo: 'John Doe', avatar: 'RF' },
    { id: '2', name: 'Robert Fox', userId: '4915500c', status: 'Added on 17 July, 2023', assignedTo: 'John Doe', avatar: 'RF' },
    { id: '3', name: 'Robert Fox', userId: '4915500c', status: 'Added on 17 July, 2023', assignedTo: 'John Doe', avatar: 'RF' },
    { id: '4', name: 'Robert Fox', userId: '4915500c', status: 'Added on 17 July, 2023', assignedTo: 'John Doe', avatar: 'RF' },
    { id: '5', name: 'Robert Fox', userId: '4915500c', status: 'Added on 17 July, 2023', assignedTo: 'John Doe', avatar: 'RF' },
    { id: '6', name: 'Robert Fox', userId: '4915500c', status: 'Added on 17 July, 2023', assignedTo: 'John Doe', avatar: 'RF' },
  ];

  const totalItems = 142;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                Assigned To
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 mr-3">
                      {user.avatar}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">{user.userId}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">{user.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 mr-2">
                      JD
                    </div>
                    <span className="text-sm text-gray-500">{user.assignedTo}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startItem}-{endItem} out of {totalItems}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => handlePageChange(1)}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === 1 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              1
            </button>
            <button
              onClick={() => handlePageChange(2)}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === 2 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              2
            </button>
            <button
              onClick={() => handlePageChange(3)}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === 3 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              3
            </button>
            
            <span className="text-gray-400">...</span>
            
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === totalPages 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {totalPages}
            </button>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
