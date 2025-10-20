
import React, { ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
}

const HomeIcon = ({isActive}: {isActive: boolean}) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={isActive ? "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" : "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"} /></svg>);
const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const BellIcon = ({isActive}: {isActive: boolean}) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={isActive ? "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" : "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"} /></svg>);
const UserIcon = ({isActive}: {isActive: boolean}) => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={isActive ? "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" : "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"} /></svg>);
const CogIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);


const BottomNav: React.FC = () => {
    const { currentUser, notifications } = useAppContext();
    const location = useLocation();

    if (!currentUser) return null;
    
    const unreadCount = notifications.filter(n => n.toUser === currentUser.username && !n.read).length;

    const navItems = [
        { path: '/home', icon: HomeIcon, label: 'Home' },
        { path: '/search', icon: SearchIcon, label: 'Search' },
        { path: '/notifications', icon: BellIcon, label: 'Alerts', badge: unreadCount },
        { path: `/profile/${currentUser.username}`, icon: UserIcon, label: 'Profile' },
        { path: '/settings', icon: CogIcon, label: 'Settings' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#15202B]/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-around max-w-md mx-auto">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex-1 flex flex-col items-center justify-center py-2 text-xs transition-colors duration-200 ${
                                isActive ? 'text-[#1DA1F2]' : 'text-gray-500 dark:text-gray-400 hover:text-[#1DA1F2] dark:hover:text-white'
                            }`
                        }
                    >
                        {({ isActive }) => (
                           <div className="relative">
                                <item.icon isActive={isActive} />
                                {item.badge && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

const Layout: React.FC<LayoutProps> = ({ children, title, showBackButton = false }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#15202B] text-gray-900 dark:text-white fade-in">
        <div className="container mx-auto max-w-md">
            {title && (
                <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white/80 dark:bg-[#15202B]/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
                    {showBackButton && (
                        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </button>
                    )}
                    <h1 className="text-xl font-bold font-poppins text-center flex-grow">{title}</h1>
                     {showBackButton && <div className="w-6"/> /* spacer */}
                </header>
            )}
            <main className="pb-20">
                {children}
            </main>
            <footer className="text-center text-xs text-gray-500 py-4">
                Made with ❤️ by Naitik Singh | Twitos v1.0
            </footer>
            <BottomNav />
        </div>
    </div>
  );
};

export default Layout;
