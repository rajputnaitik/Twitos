
import type { User, Post, Notification, Theme } from '../types';

const DB_KEY = 'twitosDB';

interface Database {
  users: User[];
  posts: Post[];
  notifications: Notification[];
  theme: Theme;
  currentUser: string | null;
}

const defaultUserPhoto = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E0E0E0'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

const initializeDB = (): Database => {
  const dbString = localStorage.getItem(DB_KEY);
  if (dbString) {
    return JSON.parse(dbString);
  }
  
  const initialUser: User = { 
    username: "naitik", 
    password: "123456", 
    bio: "Twitos creator ✨", 
    photo: defaultUserPhoto,
    joined: Date.now(),
    following: [],
    followers: []
  };

  const initialDB: Database = {
    users: [initialUser],
    posts: [
      { id: 1, user: "naitik", text: "Mera pehla Twitos post! 👋 #Twitos", likes: [], comments: [], reposts: [], timestamp: Date.now() - 1000 * 60 * 5 }
    ],
    notifications: [],
    theme: 'light',
    currentUser: null,
  };
  localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
  return initialDB;
};


export const db = {
  get: (): Database => initializeDB(),
  set: (data: Database): void => localStorage.setItem(DB_KEY, JSON.stringify(data)),
  clear: (): void => localStorage.removeItem(DB_KEY),
};

export const timeAgo = (timestamp: number): string => {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "m";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";
  
  return Math.max(0, Math.floor(seconds)) + "s";
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
