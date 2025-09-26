export interface Portfolio {
  id: number;
  userId: number;
  title: string;
  description: string;
  coverImage: string;
  images: string[];
  category: string;
  isPublic: boolean;
  likes: number;
  views: number;
  featured: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // In a real app, this would be a hash
  avatar: string | null;
}

export interface Profile {
  userId: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  memberSince: string;
  avatar: string | null;
}

    