
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAppContext } from '../contexts/AppContext';
import { fileToBase64 } from '../lib/helpers';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login, signup } = useAppContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState<string>('');
  const [error, setError] = useState('');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setPhoto(base64);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!username || !password) {
          setError('Please enter username and password.');
          return;
      }
      const success = login(username, password);
      if (success) {
        navigate('/home');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } else {
      if (!username || password.length < 6) {
          setError('Username is required and password must be at least 6 characters.');
          return;
      }
      const success = signup({
        username,
        password,
        bio: `Hello! I'm new to Twitos!`,
        photo: photo || `https://i.pravatar.cc/150?u=${username}`,
      });
      if (success) {
        navigate('/home');
      } else {
        setError('Username already taken. Please choose another.');
      }
    }
  };
  
  const continueAsGuest = () => {
    const guestUsername = `guest${Math.floor(Math.random() * 1000)}`;
    const success = signup({
        username: guestUsername,
        bio: 'Just browsing!',
        photo: `https://i.pravatar.cc/150?u=${guestUsername}`,
    });
    if (success) {
        navigate('/home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#15202B] p-4">
      <Logo className="w-20 h-20 mb-4" />
      <div className="w-full max-w-md bg-white dark:bg-[#192734] rounded-lg shadow-md p-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 font-semibold ${isLogin ? 'text-[#1DA1F2] border-b-2 border-[#1DA1F2]' : 'text-gray-500'}`}>
            Login
          </button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 font-semibold ${!isLogin ? 'text-[#1DA1F2] border-b-2 border-[#1DA1F2]' : 'text-gray-500'}`}>
            Signup
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]" />
          {!isLogin && <input type="email" placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]" />}
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]" />
          {!isLogin && (
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Photo (optional)</label>
                <input type="file" onChange={handlePhotoUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1DA1F2]/10 file:text-[#1DA1F2] hover:file:bg-[#1DA1F2]/20"/>
            </div>
          )}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-[#1DA1F2] text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
            {isLogin ? 'Login with Twitos' : 'Signup with Twitos'}
          </button>
        </form>
        <div className="text-center mt-4">
          <button onClick={continueAsGuest} className="text-sm text-gray-500 hover:text-[#1DA1F2]">Continue as Guest</button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
