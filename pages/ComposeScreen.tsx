
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAppContext } from '../contexts/AppContext';
import { fileToBase64 } from '../lib/helpers';

const ComposeScreen: React.FC = () => {
    const { currentUser, addPost, getUser } = useAppContext();
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [image, setImage] = useState<string | undefined>(undefined);
    const MAX_CHARS = 280;
    
    const user = currentUser ? getUser(currentUser.username) : null;
    
    if (!user) {
        navigate('/auth');
        return null;
    }

    const handlePost = () => {
        if (text.trim() || image) {
            addPost({ user: user.username, text, image });
            navigate('/home');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            setImage(base64);
        }
    };

    return (
        <Layout showBackButton={true}>
            <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white/80 dark:bg-[#15202B]/80 backdrop-blur-sm">
                <button onClick={() => navigate(-1)} className="text-lg">Cancel</button>
                <button 
                    onClick={handlePost} 
                    disabled={text.length === 0 && !image}
                    className="bg-[#1DA1F2] text-white font-bold py-2 px-6 rounded-full disabled:opacity-50"
                >
                    Post
                </button>
            </header>
            <div className="p-4 flex space-x-4">
                <img src={user.photo} alt={user.username} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What's happening?"
                        className="w-full text-lg bg-transparent focus:outline-none resize-none"
                        rows={5}
                        maxLength={MAX_CHARS}
                    />
                    {image && (
                        <div className="relative mt-2">
                           <img src={image} alt="preview" className="rounded-lg max-h-80 w-full object-cover" />
                           <button onClick={() => setImage(undefined)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                           </button>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#15202B]">
                <div className="container mx-auto max-w-md flex justify-between items-center">
                    <label htmlFor="image-upload" className="cursor-pointer text-[#1DA1F2]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <div className="text-sm text-gray-500">
                        {text.length} / {MAX_CHARS}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ComposeScreen;
