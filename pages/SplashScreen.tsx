
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAppContext } from '../contexts/AppContext';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentUser) {
        navigate('/home');
      } else {
        navigate('/auth');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, currentUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1DA1F2] to-white dark:from-[#15202B] dark:to-gray-900">
      <Logo className="w-32 h-32" isAnimated={true} />
      <p className="mt-4 text-lg font-semibold text-white dark:text-gray-300 font-poppins">
        Chhoti baatein, bade jazbaat – Twitos 🕊️
      </p>
    </div>
  );
};

export default SplashScreen;
