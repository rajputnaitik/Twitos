
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, Post, Notification, Theme, Comment } from '../types';
import { db } from '../lib/helpers';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  currentUser: User | null;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  signup: (user: Omit<User, 'joined' | 'following' | 'followers'>) => boolean;
  updateUser: (updatedUser: User) => void;
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'reposts' | 'timestamp'>) => void;
  toggleLike: (postId: number) => void;
  addComment: (postId: number, commentText: string) => void;
  toggleFollow: (username: string) => void;
  users: User[];
  notifications: Notification[];
  markNotificationsAsRead: () => void;
  getUser: (username: string) => User | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(db.get().theme);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(db.get().users);
  const [posts, setPosts] = useState<Post[]>(db.get().posts);
  const [notifications, setNotifications] = useState<Notification[]>(db.get().notifications);

  useEffect(() => {
    const database = db.get();
    const loggedInUser = database.currentUser ? database.users.find(u => u.username === database.currentUser) : null;
    setCurrentUser(loggedInUser || null);
    setTheme(database.theme);
    setUsers(database.users);
    setPosts(database.posts);
    setNotifications(database.notifications);
  }, []);

  const saveData = useCallback(() => {
    const currentState = {
        users,
        posts,
        notifications,
        theme,
        currentUser: currentUser?.username || null
    };
    db.set(currentState);
  }, [users, posts, notifications, theme, currentUser]);
  
  useEffect(() => {
    saveData();
  }, [saveData]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const login = (username: string, password?: string) => {
    const database = db.get();
    const user = database.users.find(u => u.username === username);
    if (user && user.password === password) {
      setCurrentUser(user);
      db.set({ ...database, currentUser: user.username });
      return true;
    }
    if(!password && user && !user.password) { // guest
        setCurrentUser(user);
        db.set({ ...database, currentUser: user.username });
        return true;
    }
    return false;
  };

  const logout = () => {
    const database = db.get();
    db.set({ ...database, currentUser: null });
    setCurrentUser(null);
  };
  
  const signup = (newUser: Omit<User, 'joined' | 'following' | 'followers'>) => {
      const database = db.get();
      if(database.users.some(u => u.username === newUser.username)) return false;
      const userToSave: User = {
          ...newUser,
          joined: Date.now(),
          following: [],
          followers: []
      };
      const updatedUsers = [...database.users, userToSave];
      setUsers(updatedUsers);
      db.set({...database, users: updatedUsers, currentUser: userToSave.username});
      setCurrentUser(userToSave);
      return true;
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(u => u.username === updatedUser.username ? updatedUser : u));
    if(currentUser?.username === updatedUser.username) {
        setCurrentUser(updatedUser);
    }
    // also update username in posts, likes, comments etc
    setPosts(prevPosts => prevPosts.map(p => {
        const newPost = {...p};
        if(p.user === currentUser?.username) newPost.user = updatedUser.username;
        newPost.likes = p.likes.map(l => l === currentUser?.username ? updatedUser.username : l);
        newPost.comments = p.comments.map(c => c.user === currentUser?.username ? {...c, user: updatedUser.username } : c);
        return newPost;
    }));
  };
  
  const addPost = (post: Omit<Post, 'id' | 'likes' | 'comments' | 'reposts' | 'timestamp'>) => {
    if(!currentUser) return;
    const newPost: Post = {
        ...post,
        id: Date.now(),
        user: currentUser.username,
        likes: [],
        comments: [],
        reposts: [],
        timestamp: Date.now(),
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const createNotification = (
      type: Notification['type'],
      toUser: string,
      postId?: number
    ) => {
      if (!currentUser || currentUser.username === toUser) return;
      const newNotification: Notification = {
        id: Date.now(),
        type,
        fromUser: currentUser.username,
        toUser,
        postId,
        timestamp: Date.now(),
        read: false,
      };
      setNotifications(prev => [newNotification, ...prev]);
  };

  const toggleLike = (postId: number) => {
      if(!currentUser) return;
      setPosts(prevPosts => prevPosts.map(p => {
          if(p.id === postId) {
              const newLikes = p.likes.includes(currentUser.username) 
                  ? p.likes.filter(u => u !== currentUser.username)
                  : [...p.likes, currentUser.username];
              
              if (!p.likes.includes(currentUser.username)) {
                createNotification('like', p.user, p.id);
              }
              
              return {...p, likes: newLikes};
          }
          return p;
      }));
  };

  const addComment = (postId: number, text: string) => {
      if(!currentUser) return;
      setPosts(prevPosts => prevPosts.map(p => {
          if(p.id === postId) {
              const newComment: Comment = {
                  id: Date.now(),
                  user: currentUser.username,
                  text,
                  timestamp: Date.now()
              };
              createNotification('comment', p.user, p.id);
              return {...p, comments: [...p.comments, newComment]};
          }
          return p;
      }));
  };

  const toggleFollow = (usernameToFollow: string) => {
    if(!currentUser || currentUser.username === usernameToFollow) return;
    
    setUsers(prevUsers => {
      return prevUsers.map(user => {
        // Add to current user's following list
        if(user.username === currentUser.username) {
          const isFollowing = user.following.includes(usernameToFollow);
          const newFollowing = isFollowing 
            ? user.following.filter(u => u !== usernameToFollow)
            : [...user.following, usernameToFollow];
          if(!isFollowing) {
            createNotification('follow', usernameToFollow);
          }
          setCurrentUser({...user, following: newFollowing});
          return {...user, following: newFollowing};
        }
        // Add to target user's followers list
        if(user.username === usernameToFollow) {
          const newFollowers = user.followers.includes(currentUser.username)
            ? user.followers.filter(u => u !== currentUser.username)
            : [...user.followers, currentUser.username];
          return {...user, followers: newFollowers};
        }
        return user;
      });
    });
  };

  const markNotificationsAsRead = () => {
      setNotifications(prev => prev.map(n => ({...n, read: true})));
  };

  const getUser = (username: string) => {
      return users.find(u => u.username === username);
  }

  const value = { 
    theme, toggleTheme, currentUser, login, logout, signup, updateUser,
    posts, addPost, toggleLike, addComment,
    toggleFollow, users, notifications, markNotificationsAsRead, getUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
