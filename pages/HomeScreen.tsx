
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const HomeScreen: React.FC = () => {
    const { currentUser, posts, getUser } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/auth');
        }
    }, [currentUser, navigate]);
    
    const user = currentUser ? getUser(currentUser.username) : null;

    if (!currentUser || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        )
    }

    const postsForFeed = posts.sort((a, b) => b.timestamp - a.timestamp);

    return (
        <Layout>
            <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white/80 dark:bg-[#15202B]/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
                <img src={user.photo} alt={user.username} className="w-8 h-8 rounded-full cursor-pointer" onClick={() => navigate(`/profile/${user.username}`)} />
                <h1 className="text-xl font-bold font-poppins text-center flex-grow text-[#1DA1F2]">Twitos</h1>
                <button onClick={() => navigate('/compose')} className="p-2 -mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
            </header>
            <div>
                {postsForFeed.length > 0 ? (
                    postsForFeed.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                    <div className="text-center p-8 text-gray-500">
                        <p>It's quiet in here... Time to make some noise!</p>
                        <button onClick={() => navigate('/compose')} className="mt-4 bg-gradient-to-r from-blue-400 to-[#1DA1F2] text-white font-bold py-2 px-4 rounded-full">
                            Create First Post
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default HomeScreen;
