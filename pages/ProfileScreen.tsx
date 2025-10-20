
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAppContext } from '../contexts/AppContext';
import PostCard from '../components/PostCard';
import type { User } from '../types';
import { fileToBase64 } from '../lib/helpers';

const EditProfileModal: React.FC<{ user: User; onClose: () => void }> = ({ user, onClose }) => {
    const { updateUser } = useAppContext();
    const [bio, setBio] = useState(user.bio);
    const [photo, setPhoto] = useState(user.photo);
    const [banner, setBanner] = useState(user.banner || '');

    const handleSave = () => {
        updateUser({ ...user, bio, photo, banner });
        onClose();
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]){
            setPhoto(await fileToBase64(e.target.files[0]));
        }
    };
    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]){
            setBanner(await fileToBase64(e.target.files[0]));
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-[#192734] rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Edit Profile</h2>
                    <button onClick={handleSave} className="bg-[#1DA1F2] text-white px-4 py-1 rounded-full font-semibold">Save</button>
                </div>
                <div className="p-4 space-y-4">
                     <div>
                        <label className="block text-sm font-medium mb-1">Banner Image</label>
                        <input type="file" onChange={handleBannerUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1DA1F2]/10 file:text-[#1DA1F2] hover:file:bg-[#1DA1F2]/20"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Profile Photo</label>
                        <input type="file" onChange={handlePhotoUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1DA1F2]/10 file:text-[#1DA1F2] hover:file:bg-[#1DA1F2]/20"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-2" rows={3}></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ProfileScreen: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const { currentUser, posts, getUser, toggleFollow } = useAppContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('posts');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const profileUser = username ? getUser(username) : null;

    useEffect(() => {
        if (!profileUser) {
            navigate('/home');
        }
    }, [profileUser, navigate]);
    
    if (!profileUser) return null;

    const userPosts = posts.filter(p => p.user === profileUser.username);
    const likedPosts = posts.filter(p => p.likes.includes(profileUser.username));
    
    const isFollowing = currentUser?.following.includes(profileUser.username) ?? false;
    const isCurrentUserProfile = currentUser?.username === profileUser.username;

    const renderContent = () => {
        switch (activeTab) {
            case 'posts': return userPosts.map(post => <PostCard key={post.id} post={post} />);
            case 'likes': return likedPosts.map(post => <PostCard key={post.id} post={post} />);
            case 'replies': return <p className="text-center p-4 text-gray-500">Replies are not yet implemented.</p>;
            default: return null;
        }
    };
    
    return (
        <Layout showBackButton={true}>
            <div className="border-b border-gray-200 dark:border-gray-800">
                <div className="h-32 bg-gray-300 dark:bg-gray-700 bg-cover bg-center" style={{backgroundImage: `url(${profileUser.banner || 'https://picsum.photos/600/200'})`}} />
                <div className="p-4">
                    <div className="flex justify-between">
                        <img src={profileUser.photo} alt={profileUser.username} className="-mt-16 w-24 h-24 rounded-full border-4 border-white dark:border-[#192734]" />
                        {isCurrentUserProfile ? (
                            <button onClick={() => setIsEditModalOpen(true)} className="border border-gray-300 dark:border-gray-600 rounded-full px-4 py-1.5 font-semibold self-start hover:bg-gray-100 dark:hover:bg-gray-800">Edit Profile</button>
                        ) : (
                            <button onClick={() => toggleFollow(profileUser.username)} className={`${isFollowing ? 'bg-transparent text-white border border-white' : 'bg-white text-black'} rounded-full px-4 py-1.5 font-semibold self-start`}>
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>
                        )}
                    </div>
                    <h2 className="text-xl font-bold mt-2">{profileUser.username}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{profileUser.bio}</p>
                    <div className="flex space-x-4 text-sm text-gray-500 mt-2">
                        <span>Joined {new Date(profileUser.joined).toLocaleDateString('en-us', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex space-x-4 mt-2">
                        <p><span className="font-bold">{profileUser.following.length}</span> Following</p>
                        <p><span className="font-bold">{profileUser.followers.length}</span> Followers</p>
                    </div>
                </div>
            </div>
            
            <div className="flex border-b border-gray-200 dark:border-gray-800">
                <button onClick={() => setActiveTab('posts')} className={`flex-1 py-3 font-semibold ${activeTab === 'posts' ? 'text-[#1DA1F2] border-b-2 border-[#1DA1F2]' : 'text-gray-500'}`}>Posts</button>
                <button onClick={() => setActiveTab('likes')} className={`flex-1 py-3 font-semibold ${activeTab === 'likes' ? 'text-[#1DA1F2] border-b-2 border-[#1DA1F2]' : 'text-gray-500'}`}>Likes</button>
                <button onClick={() => setActiveTab('replies')} className={`flex-1 py-3 font-semibold ${activeTab === 'replies' ? 'text-[#1DA1F2] border-b-2 border-[#1DA1F2]' : 'text-gray-500'}`}>Replies</button>
            </div>
            
            <div>{renderContent()}</div>
            {isEditModalOpen && <EditProfileModal user={profileUser} onClose={() => setIsEditModalOpen(false)} />}
        </Layout>
    );
};

export default ProfileScreen;
