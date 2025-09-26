'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useApp } from './app-provider';
import type { User, Profile, Portfolio, Job } from '@/lib/types';
import { users, profiles, portfolios as initialPortfoliosData, jobs as initialJobsData } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  portfolios: Portfolio[];
  jobs: Job[];
  addPortfolio: (newPortfolio: Omit<Portfolio, 'id' | 'userId' | 'likes' | 'views'>) => void;
  updatePortfolio: (updatedPortfolio: Portfolio) => void;
  deletePortfolio: (portfolioId: number) => void;
  addJob: (newJob: Omit<Job, 'id' | 'clientId'>) => void;
  updateProfile: (updatedProfile: Profile) => void;
  handleLogin: (email: string, password: string) => Promise<{ error?: string }>;
  handleSignup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  handleGoogleLogin: () => void;
  handleLogout: () => void;
  openLogin: () => void;
  openSignup: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This provider is a mock. In a real app, this would be handled by a proper auth library like NextAuth.js
// and data would be fetched from a database.
export function AuthProvider({ children }: { children: ReactNode }) {
  const { openModal, closeModal } = useApp();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfoliosData);
  const [jobs, setJobs] = useState<Job[]>(initialJobsData);


  useEffect(() => {
    // Mock checking for a logged-in user, e.g., from localStorage
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (loggedInUserEmail) {
      const foundUser = users.find(u => u.email === loggedInUserEmail);
      if (foundUser) {
        setUser(foundUser);
        const foundProfile = profiles.find(p => p.userId === foundUser.id);
        setProfile(foundProfile || null);
      }
    } else {
        const guestProfile = profiles.find(p => p.userId === 1);
        setProfile(guestProfile || null);
    }
  }, []);

  const login = (loggedInUser: User) => {
    setUser(loggedInUser);
    const foundProfile = profiles.find(p => p.userId === loggedInUser.id);
    setProfile(foundProfile || null);
    localStorage.setItem('loggedInUser', loggedInUser.email);
    closeModal();
  };

  const handleLogin = async (email: string, password: string): Promise<{ error?: string }> => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      login(foundUser);
      return {};
    }
    return { error: 'Invalid email or password.' };
  };

  const handleSignup = async (name: string, email: string, password: string): Promise<{ error?: string }> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: 'Please enter a valid email address.' };
    }
    if (users.find(u => u.email === email)) {
      return { error: 'An account with this email already exists.' };
    }
    
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      password,
      avatar: `https://i.pravatar.cc/150?u=${email}`
    };
    users.push(newUser);

    const newProfile: Profile = {
        userId: newUser.id,
        name,
        email,
        title: 'Creative Professional',
        phone: '',
        location: '',
        bio: `Welcome to my creative hub! I'm ${name}.`,
        skills: [],
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        avatar: newUser.avatar,
    };
    profiles.push(newProfile);

    login(newUser);
    return {};
  };

  const handleGoogleLogin = () => {
    const googleUser = users.find(u => u.email === 'aung.myat@gmail.com');
    if (googleUser) {
      login(googleUser);
    }
  };

  const handleLogout = () => {
    setUser(null);
    const guestProfile = profiles.find(p => p.userId === 1);
    setProfile(guestProfile || null);
    localStorage.removeItem('loggedInUser');
  };

  const addPortfolio = (newPortfolioData: Omit<Portfolio, 'id' | 'userId' | 'likes' | 'views'>) => {
    if (user) {
      const newPortfolio: Portfolio = {
        id: Date.now(),
        userId: user.id,
        ...newPortfolioData,
        likes: 0,
        views: 0,
      };
      const updatedPortfolios = [newPortfolio, ...portfolios];
      setPortfolios(updatedPortfolios);
      initialPortfoliosData.unshift(newPortfolio);
    }
  };

  const updatePortfolio = (updatedPortfolio: Portfolio) => {
    setPortfolios(prev => {
        const newPortfolios = prev.map(p => p.id === updatedPortfolio.id ? updatedPortfolio : p);
        const index = initialPortfoliosData.findIndex(p => p.id === updatedPortfolio.id);
        if (index !== -1) {
            initialPortfoliosData[index] = updatedPortfolio;
        }
        return newPortfolios;
    });
  };

  const deletePortfolio = (portfolioId: number) => {
    setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
    const index = initialPortfoliosData.findIndex(p => p.id === portfolioId);
    if (index !== -1) {
      initialPortfoliosData.splice(index, 1);
    }
  };
  
  const addJob = (newJobData: Omit<Job, 'id' | 'clientId'>) => {
    if(user) {
        const newJob: Job = {
            id: Date.now(),
            clientId: user.id,
            ...newJobData,
        };
        const updatedJobs = [newJob, ...jobs];
        setJobs(updatedJobs);
        initialJobsData.unshift(newJob);
    }
  };

  const updateProfile = (updatedProfile: Profile) => {
    if (user && user.id === updatedProfile.userId) {
      setProfile(updatedProfile);
      const profileIndex = profiles.findIndex(p => p.userId === updatedProfile.userId);
      if (profileIndex !== -1) {
        profiles[profileIndex] = updatedProfile;
      }
      
      const userIndex = users.findIndex(u => u.id === updatedProfile.userId);
      if (userIndex !== -1 && updatedProfile.avatar) {
        users[userIndex].avatar = updatedProfile.avatar;
      }
    }
  };


  const openLogin = () => openModal('login');
  const openSignup = () => openModal('signup');

  const value = {
    user,
    profile,
    portfolios,
    jobs,
    addPortfolio,
    updatePortfolio,
    deletePortfolio,
    addJob,
    updateProfile,
    handleLogin,
    handleSignup,
    handleGoogleLogin,
    handleLogout,
    openLogin,
    openSignup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
