
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';

import SplashScreen from './pages/SplashScreen';
import AuthScreen from './pages/AuthScreen';
import HomeScreen from './pages/HomeScreen';
import SearchScreen from './pages/SearchScreen';
import NotificationsScreen from './pages/NotificationsScreen';
import ProfileScreen from './pages/ProfileScreen';
import SettingsScreen from './pages/SettingsScreen';
import ComposeScreen from './pages/ComposeScreen';

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

const MainApp: React.FC = () => {
  const { theme } = useAppContext();

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/search" element={<SearchScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/profile/:username" element={<ProfileScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/compose" element={<ComposeScreen />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
