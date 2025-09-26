'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useApp } from './app-provider';
import type { User, Profile, Portfolio, Job } from '@/lib/types';
import { users as initialUsers, profiles as initialProfiles, portfolios as initialPortfoliosData, jobs as initialJobsData } from '@/lib/data';
import { auth } from '@/lib/firebase';
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

// We will keep `initialProfiles` to find existing mock profiles or create new ones.
let profiles: Profile[] = [...initialProfiles];

// This function now primarily handles mapping and profile creation/retrieval.
const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser): { appUser: User, appProfile: Profile | null } => {
  const appUser: User = {
    id: firebaseUser.uid.hashCode(), // Simple hash for a numeric ID
    name: firebaseUser.displayName || 'New User',
    email: firebaseUser.email!,
    avatar: firebaseUser.photoURL,
  };

  let userProfile = profiles.find(p => p.email === appUser.email);
  
  if (!userProfile) {
    const newProfile: Profile = {
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
    profiles.push(newProfile);
    userProfile = newProfile;
  } else if (appUser.name !== userProfile.name || appUser.avatar !== userProfile.avatar) {
    // Update profile if Firebase user info is different
    userProfile.name = appUser.name;
    userProfile.avatar = appUser.avatar;
  }

  return { appUser, appProfile: userProfile };
};

// Simple hash function for string to get a number ID
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const { openModal, closeModal } = useApp();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfoliosData);
  const [jobs, setJobs] = useState<Job[]>(initialJobsData);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const { appUser, appProfile } = mapFirebaseUserToAppUser(firebaseUser);
        setUser(appUser);
        setProfile(appProfile);
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
      console.error("Login Error:", error.code, error.message);
      return { error: error.message };
    }
  };

  const handleSignup = async (name: string, email: string, password: string): Promise<{ error?: string }> => {
     try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      await updateFirebaseProfile(firebaseUser, { displayName: name });
      
      // After creating user, immediately map and set profile
      const { appUser, appProfile } = mapFirebaseUserToAppUser(firebaseUser);
      setUser(appUser);
      setProfile(appProfile);
      
      closeModal();
      return {};
    } catch (error: any) {
       console.error("Signup Error:", error.code, error.message);
       return { error: error.message };
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      closeModal();
    } catch (error: any) {
      console.error("Google login error:", error.code, error.message);
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
      
      if(auth.currentUser) {
        setUser(currentUser => currentUser ? { ...currentUser, name: updatedProfile.name, avatar: updatedProfile.avatar } : null);

        if (auth.currentUser.displayName !== updatedProfile.name || auth.currentUser.photoURL !== updatedProfile.avatar) {
            updateFirebaseProfile(auth.currentUser, { displayName: updatedProfile.name, photoURL: updatedProfile.avatar });
        }
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
      return null;
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
