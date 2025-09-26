'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/components/providers/app-provider';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import LoginModal from '@/components/auth/login-modal';
import SignupModal from '@/components/auth/signup-modal';

export default function AppLayout({
  user,
  children,
}: {
  user: any;
  children: ReactNode;
}) {
  const { isSidebarOpen, activeModal } = useApp();
  const pathname = usePathname();

  useEffect(() => {
    // Close sidebar on navigation
  }, [pathname]);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <main
          className={`flex-1 transition-all duration-300 ease-in-out pt-16 ${
            isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
          }`}
        >
          <div className="max-w-7xl mx-auto p-4 lg:p-8">{children}</div>
        </main>
      </div>

      {activeModal === 'login' && <LoginModal />}
      {activeModal === 'signup' && <SignupModal />}
    </div>
  );
}
