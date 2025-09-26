
'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useApp } from './app-provider';
import type { User, Profile, Portfolio, Job } from '@/lib/types';
import { users as initialUsers, profiles as initialProfiles, portfolios as initialPortfoliosData, jobs as initialJobsData } from '@/lib/data';
import { app, auth } from '@/lib/firebase'; // Ensure app is imported
import { 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
  type User as FirebaseUser
} from 'firebase/auth';

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

// In a real production app, users and profiles would be stored in a database like Firestore,
// not in-memory arrays. For this prototype, we'll merge Firebase Auth with our local data.
let users: User[] = [...initialUsers];
let profiles: Profile[] = [...initialProfiles];


const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser): User => {
  // Check if user already exists in our mock data
  let appUser = users.find(u => u.email === firebaseUser.email);
  if (appUser) {
    // Update avatar from Google if available
    if(firebaseUser.photoURL && appUser.avatar !== firebaseUser.photoURL) {
      appUser.avatar = firebaseUser.photoURL;
    }
    return appUser;
  }
  
  // If new user, create them
  appUser = {
    id: Date.now(), // In a real app, use a proper ID system
    name: firebaseUser.displayName || 'New User',
    email: firebaseUser.email!,
    avatar: firebaseUser.photoURL
  };
  users.push(appUser);
  
  // Create a profile for the new user
  let userProfile = profiles.find(p => p.userId === appUser!.id);
  if (!userProfile) {
    userProfile = {
      userId: appUser.id,
      name: appUser.name,
      email: appUser.email,
      avatar: appUser.avatar,
      title: 'Creative Professional',
      phone: '',
      location: '',
      bio: `Welcome to my creative hub! I'm ${appUser.name}.`,
      skills: [],
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
    profiles.push(userProfile);
  }
  
  return appUser;
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const { openModal, closeModal } = useApp();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfoliosData);
  const [jobs, setJobs] = useState<Job[]>(initialJobsData);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Reference the app to ensure it's initialized before using auth
    const firebaseApp = app; 
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const appUser = mapFirebaseUserToAppUser(firebaseUser);
        setUser(appUser);
        const foundProfile = profiles.find(p => p.userId === appUser.id);
        setProfile(foundProfile || null);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      closeModal();
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const handleSignup = async (name: string, email: string, password: string): Promise<{ error?: string }> => {
     try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateFirebaseProfile(userCredential.user, { displayName: name });
      
      // Manually map to ensure our local mock data is updated for this session
      mapFirebaseUserToAppUser(userCredential.user);
      
      closeModal();
      return {};
    } catch (error: any) {
       return { error: error.message };
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      closeModal();
    } catch (error: any) {
      console.error("Google login error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
          return;
      }
      // You can add more specific error handling here if needed
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
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
      if (userIndex !== -1) {
          users[userIndex].name = updatedProfile.name;
          if (updatedProfile.avatar) {
            users[userIndex].avatar = updatedProfile.avatar;
          }
      }

      if (auth.currentUser && auth.currentUser.displayName !== updatedProfile.name) {
          updateFirebaseProfile(auth.currentUser, { displayName: updatedProfile.name, photoURL: updatedProfile.avatar });
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

  if (loading) {
      return null; // Or a loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
