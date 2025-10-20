
import React, { useState } from 'react';
import type { Post, User, Comment } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { timeAgo } from '../lib/helpers';
import { useNavigate } from 'react-router-dom';

interface PostCardProps {
  post: Post;
}

// Modal for comments
const CommentModal: React.FC<{ post: Post, onClose: () => void }> = ({ post, onClose }) => {
    const { currentUser, addComment, getUser } = useAppContext();
    const [commentText, setCommentText] = useState('');

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            addComment(post.id, commentText);
            setCommentText('');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-[#192734] rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-lg font-bold">Comments</h2>
                </div>
                <div className="overflow-y-auto flex-grow p-4 space-y-4">
                    {post.comments.length > 0 ? (
                        post.comments.map(comment => {
                           const commentUser = getUser(comment.user);
                           return (
                            <div key={comment.id} className="flex items-start space-x-3">
                                <img src={commentUser?.photo} alt={commentUser?.username} className="w-8 h-8 rounded-full" />
                                <div className="flex-1">
                                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                                        <p className="font-semibold text-sm">{commentUser?.username}</p>
                                        <p className="text-sm">{comment.text}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{timeAgo(comment.timestamp)}</span>
                                </div>
                            </div>
                           )
                        })
                    ) : (
                        <p className="text-center text-gray-500">No comments yet.</p>
                    )}
                </div>
                {currentUser && (
                    <form onSubmit={handleCommentSubmit} className="p-4 border-t dark:border-gray-700 flex items-center space-x-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                        />
                        <button type="submit" className="bg-[#1DA1F2] text-white rounded-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};


const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { currentUser, toggleLike, getUser } = useAppContext();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const postUser = getUser(post.user);

  if (!postUser) return null;

  const isLikedByCurrentUser = currentUser ? post.likes.includes(currentUser.username) : false;

  const handleLikeClick = () => {
    if(!currentUser) return;
    setLiked(true);
    toggleLike(post.id);
    setTimeout(() => setLiked(false), 300); // Reset animation class
  };

  const handleUserClick = () => {
      navigate(`/profile/${postUser.username}`);
  }

  const formattedText = post.text.replace(/#(\w+)/g, '<a href="#" class="text-[#1DA1F2] hover:underline">#$1</a>');

  return (
    <>
      <div className="bg-white dark:bg-[#192734] p-4 border-b border-gray-200 dark:border-gray-800 flex space-x-4">
        <img src={postUser.photo} alt={postUser.username} className="w-12 h-12 rounded-full cursor-pointer" onClick={handleUserClick} />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <p className="font-bold cursor-pointer" onClick={handleUserClick}>{postUser.username}</p>
            <p className="text-gray-500 text-sm">· {timeAgo(post.timestamp)}</p>
          </div>
          <div className="mt-1 text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: formattedText }} />
          {post.image && <img src={post.image} alt="post" className="mt-2 rounded-lg max-h-80 w-full object-cover" />}
          
          <div className="flex justify-between items-center mt-4 text-gray-500">
            <button onClick={() => setIsCommentModalOpen(true)} className="flex items-center space-x-2 hover:text-[#1DA1F2] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <span>{post.comments.length}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>
              <span>{post.reposts.length}</span>
            </button>
            <button onClick={handleLikeClick} className={`flex items-center space-x-2 hover:text-red-500 transition-colors ${isLikedByCurrentUser ? 'text-red-500' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${liked ? 'scale-up' : ''}`} viewBox="0 0 20 20" fill={isLikedByCurrentUser ? 'currentColor' : 'none'} stroke="currentColor"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
              <span>{post.likes.length}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-[#1DA1F2] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </button>
          </div>
        </div>
      </div>
      {isCommentModalOpen && <CommentModal post={post} onClose={() => setIsCommentModalOpen(false)} />}
    </>
  );
};

export default PostCard;
