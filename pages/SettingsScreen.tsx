
import React from 'react';
import Layout from '../components/Layout';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/helpers';

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleResetApp = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        db.clear();
        navigate(0); // Reload page
    }
  };
  
  const SettingItem: React.FC<{children: React.ReactNode, onClick?: () => void}> = ({ children, onClick }) => (
      <div onClick={onClick} className={`bg-white dark:bg-[#192734] p-4 flex justify-between items-center ${onClick ? 'cursor-pointer' : ''} border-b border-gray-200 dark:border-gray-800`}>
          {children}
      </div>
  );

  return (
    <Layout title="Settings">
        <div className="mt-4">
            <SettingItem>
                <div className="flex items-center space-x-3">
                    <span role="img" aria-label="moon">🌙</span>
                    <span>Dark Mode</span>
                </div>
                <label htmlFor="theme-toggle" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="theme-toggle" className="sr-only peer" checked={theme === 'dark'} onChange={toggleTheme} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#1DA1F2]"></div>
                </label>
            </SettingItem>
            
            <SettingItem onClick={() => alert('Feature coming soon!')}>
                <span>Change Username/Password</span>
            </SettingItem>
            
            <SettingItem onClick={handleLogout}>
                <span className="text-blue-500">Log Out</span>
            </SettingItem>

            <SettingItem onClick={handleResetApp}>
                <span className="text-red-500">Clear All Local Data (Reset App)</span>
            </SettingItem>

            <div className="p-4 mt-4 bg-white dark:bg-[#192734]">
                <h3 className="font-bold mb-2">About Twitos</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Version 1.0</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Made with ❤️ by Naitik Singh</p>
                <a href="mailto:support@twitos.app" className="text-sm text-[#1DA1F2] mt-2 block">Contact Support</a>
            </div>
        </div>
    </Layout>
  );
};

export default SettingsScreen;
