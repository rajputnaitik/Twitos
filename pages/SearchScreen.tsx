
import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { useAppContext } from '../contexts/AppContext';
import PostCard from '../components/PostCard';
import type { Post } from '../types';

const SearchScreen: React.FC = () => {
    const { posts } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const trendingHashtags = ['#Twitos', '#DailyVibe', '#ReactJS', '#TailwindCSS', '#LocalFirst'];
    
    const filteredPosts = useMemo(() => {
        if (!searchTerm.trim()) {
            return [];
        }
        return posts.filter(post => 
            post.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
            post.user.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, posts]);
    
    const handleTagClick = (tag: string) => {
        setSearchTerm(tag);
    };

    return (
        <Layout title="Search & Explore">
            <div className="p-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search Twitos"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-gray-800 rounded-full px-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>

                {!searchTerm.trim() && (
                    <div className="mt-6">
                        <h3 className="font-bold text-lg mb-2">Trending</h3>
                        <div className="flex flex-wrap gap-2">
                            {trendingHashtags.map(tag => (
                                <button key={tag} onClick={() => handleTagClick(tag)} className="bg-gray-200 dark:bg-gray-700 text-sm font-semibold text-[#1DA1F2] rounded-full px-3 py-1 hover:bg-gray-300 dark:hover:bg-gray-600">
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div>
                {searchTerm.trim() && filteredPosts.length > 0 && (
                     filteredPosts.map(post => <PostCard key={post.id} post={post} />)
                )}
                {searchTerm.trim() && filteredPosts.length === 0 && (
                    <p className="text-center text-gray-500 mt-8">No results found for "{searchTerm}"</p>
                )}
            </div>
        </Layout>
    );
};

export default SearchScreen;
