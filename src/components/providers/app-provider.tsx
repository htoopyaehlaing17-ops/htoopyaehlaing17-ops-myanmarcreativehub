'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { Portfolio, Job } from '@/lib/types';

type ModalType = 'login' | 'signup' | 'uploadPortfolio' | 'editProfile' | 'createJob' | null;

interface ModalData {
    portfolio?: Portfolio;
    job?: Job;
}

interface AppContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  activeModal: ModalType;
  modalData: ModalData;
  openModal: (modal: ModalType, data?: ModalData) => void;
  closeModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<ModalData>({});

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const openModal = (modal: ModalType, data: ModalData = {}) => {
    setActiveModal(modal);
    setModalData(data);
  };
  const closeModal = () => {
    setActiveModal(null);
    setModalData({});
  };

  const value = {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    activeModal,
    modalData,
    openModal,
    closeModal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
