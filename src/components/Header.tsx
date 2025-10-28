import React from 'react';
import { FaBell } from 'react-icons/fa';
import UserDropdown from './UserDropdown';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
        >
          ☰
        </button>
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          <FaBell className="text-xl" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
        </button>
        
        {/* User Dropdown */}
        {user && (
          <UserDropdown 
            user={{
              name: user.discordUsername || 'Admin User',
              email: user.email,
              avatar: user.avatar
            }}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
