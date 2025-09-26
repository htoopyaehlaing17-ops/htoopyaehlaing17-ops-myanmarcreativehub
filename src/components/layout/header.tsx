'use client';

import { LogIn, UserPlus, Menu, LogOut } from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { toggleSidebar, isSidebarOpen } = useApp();
  const { user, handleLogout, openLogin, openSignup } = useAuth();
  const pathname = usePathname();

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-sm border-b transition-all duration-300 ease-in-out',
        isSidebarOpen ? 'lg:left-64' : 'left-0'
      )}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="menu-button p-2 rounded-md hover:bg-muted transition-colors duration-200"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="text-lg font-semibold font-headline text-foreground">
            Myanmar Creative Hub
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={openLogin}
                className="flex items-center gap-1 text-sm"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
              <Button
                variant="ghost"
                onClick={openSignup}
                className="hidden sm:flex items-center gap-1 text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Signup
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
