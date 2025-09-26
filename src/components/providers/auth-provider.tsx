'use client';

import React, { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { useApp } from './app-provider';
import type { User, Profile, Portfolio, Job } from '@/lib/types';
import { users as initialUsers, profiles as initialProfiles, portfolios as initialPortfolios, jobs as initialJobsData } from '@/lib/data';
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

// --- State and Actions ---
interface AuthState {
  user: User | null;
  profile: Profile | null;
  portfolios: Portfolio[];
  jobs: Job[];
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  portfolios: initialPortfolios,
  jobs: initialJobsData,
  loading: true,
};

type AuthAction =
  | { type: 'SET_USER_AND_PROFILE'; payload: { user: User | null; profile: Profile | null } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_PORTFOLIO'; payload: Portfolio }
  | { type: 'UPDATE_PORTFOLIO'; payload: Portfolio }
  | { type: 'DELETE_PORTFOLIO'; payload: number }
  | { type: 'ADD_JOB'; payload: Job }
  | { type: 'UPDATE_PROFILE'; payload: Profile };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER_AND_PROFILE':
      return { ...state, user: action.payload.user, profile: action.payload.profile };
    case 'ADD_PORTFOLIO':
      const newPortfolios = [action.payload, ...state.portfolios];
      initialPortfolios.unshift(action.payload); // Keep mock data in sync
      return { ...state, portfolios: newPortfolios };
    case 'UPDATE_PORTFOLIO':
      const updatedPortfolios = state.portfolios.map(p => p.id === action.payload.id ? action.payload : p);
       const portfolioIndex = initialPortfolios.findIndex(p => p.id === action.payload.id);
        if (portfolioIndex !== -1) {
            initialPortfolios[portfolioIndex] = action.payload;
        }
      return { ...state, portfolios: updatedPortfolios };
    case 'DELETE_PORTFOLIO':
        const filteredPortfolios = state.portfolios.filter(p => p.id !== action.payload);
        const portfolioToDeleteIndex = initialPortfolios.findIndex(p => p.id === action.payload);
        if (portfolioToDeleteIndex !== -1) {
            initialPortfolios.splice(portfolioToDeleteIndex, 1);
        }
      return { ...state, portfolios: filteredPortfolios };
    case 'ADD_JOB':
        const newJobs = [action.payload, ...state.jobs];
        initialJobsData.unshift(action.payload);
      return { ...state, jobs: newJobs };
    case 'UPDATE_PROFILE':
        const profileIndex = initialProfiles.findIndex(p => p.userId === action.payload.userId);
        if (profileIndex !== -1) {
            initialProfiles[profileIndex] = action.payload;
        }
      return { ...state, profile: action.payload };
    default:
      return state;
  }
};


// --- Helper Functions ---
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; 
  }
  return Math.abs(hash);
};

const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser): { appUser: User, appProfile: Profile } => {
  const existingProfile = initialProfiles.find(p => p.email === firebaseUser.email);

  if (existingProfile) {
      const appUser: User = {
        id: existingProfile.userId,
        name: firebaseUser.displayName || existingProfile.name,
        email: firebaseUser.email!,
        avatar: firebaseUser.photoURL || existingProfile.avatar,
      };
      existingProfile.name = appUser.name;
      existingProfile.avatar = appUser.avatar;
      return { appUser, appProfile: existingProfile };
  }
  
  // Create new user and profile if not in mock data
  const newUserId = firebaseUser.uid.hashCode();
  const appUser: User = {
    id: newUserId,
    name: firebaseUser.displayName || 'New User',
    email: firebaseUser.email!,
    avatar: firebaseUser.photoURL,
  };

  const newProfile: Profile = {
    userId: newUserId,
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
  
  initialProfiles.push(newProfile); // Add to our mock DB
  
  return { appUser, appProfile: newProfile };
};


// --- Context Definition ---
interface AuthContextType {
  state: AuthState;
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

// --- Provider Component ---
export function AuthProvider({ children }: { children: ReactNode }) {
  const { openModal, closeModal } = useApp();
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const { appUser, appProfile } = mapFirebaseUserToAppUser(firebaseUser);
        dispatch({ type: 'SET_USER_AND_PROFILE', payload: { user: appUser, profile: appProfile } });
      } else {
        dispatch({ type: 'SET_USER_AND_PROFILE', payload: { user: null, profile: null } });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
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
      // onAuthStateChanged will handle setting the user and profile
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
      // onAuthStateChanged will handle setting the user and profile
      closeModal();
    } catch (error: any) {
      console.error("Google login error:", error.code, error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const addPortfolio = (data: Omit<Portfolio, 'id' | 'userId' | 'likes' | 'views'>) => {
    if (state.user) {
      const newPortfolio: Portfolio = { id: Date.now(), userId: state.user.id, likes: 0, views: 0, ...data };
      dispatch({ type: 'ADD_PORTFOLIO', payload: newPortfolio });
    }
  };
  
  const updatePortfolio = (portfolio: Portfolio) => dispatch({ type: 'UPDATE_PORTFOLIO', payload: portfolio });
  const deletePortfolio = (id: number) => dispatch({ type: 'DELETE_PORTFOLIO', payload: id });

  const addJob = (data: Omit<Job, 'id' | 'clientId'>) => {
    if(state.user) {
        const newJob: Job = { id: Date.now(), clientId: state.user.id, ...data };
        dispatch({ type: 'ADD_JOB', payload: newJob });
    }
  };

  const updateProfile = async (profile: Profile) => {
    if (state.user && auth.currentUser && state.user.id === profile.userId) {
       if (auth.currentUser.displayName !== profile.name || auth.currentUser.photoURL !== profile.avatar) {
            await updateFirebaseProfile(auth.currentUser, { displayName: profile.name, photoURL: profile.avatar || undefined });
        }
      dispatch({ type: 'UPDATE_PROFILE', payload: profile });
    }
  };

  const openLogin = () => openModal('login');
  const openSignup = () => openModal('signup');

  const value = {
    state: { ...state, portfolios: state.portfolios, jobs: state.jobs, user: state.user, profile: state.profile },
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
  
  if (state.loading) {
      return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


// --- Hook ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // This simplifies access in components: `user` instead of `state.user`
  return {
      ...context.state,
      ...context
  };
}
