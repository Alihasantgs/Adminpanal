import React from 'react';
import { FaChartBar, FaUsers, FaBox, FaShoppingCart, FaCog } from 'react-icons/fa';
import UserDropdown from './UserDropdown';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  
  const menuItems = [
    { name: 'Dashboard', icon: FaChartBar, href: '#', active: true },
    { name: 'Users', icon: FaUsers, href: '#' },
    { name: 'Products', icon: FaBox, href: '#' },
    { name: 'Orders', icon: FaShoppingCart, href: '#' },
    { name: 'Settings', icon: FaCog, href: '#' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${item.active 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon className="mr-3 text-lg" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User Section */}
        {user && (
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
            <UserDropdown 
              user={{
                name: user.name,
                email: user.email,
                avatar: user.avatar
              }}
              className="w-full"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
