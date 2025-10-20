
export interface Comment {
  id: number;
  user: string;
  text: string;
  timestamp: number;
}

export interface Post {
  id: number;
  user: string;
  text: string;
  image?: string;
  likes: string[]; // Array of usernames
  comments: Comment[];
  reposts: string[]; // Array of usernames
  timestamp: number;
}

export interface User {
  username: string;
  password?: string; // Optional for guest
  bio: string;
  photo: string;
  banner?: string;
  joined: number;
  following: string[];
  followers: string[];
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'repost';

export interface Notification {
  id: number;
  type: NotificationType;
  fromUser: string;
  toUser: string;
  postId?: number;
  timestamp: number;
  read: boolean;
}

export type Theme = 'light' | 'dark';
