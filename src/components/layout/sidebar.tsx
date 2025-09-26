'use client';

import { X, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/components/providers/app-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { MENU_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useApp();
  const { user, openLogin, openSignup } = useAuth();
  const pathname = usePathname();

  const handleLinkClick = (href: string) => {
    if (MENU_ITEMS.find(item => item.href === href)?.auth && !user) {
      openLogin();
    } else {
      closeSidebar();
    }
  };

  return (
    <>
      <aside
        className={cn(
          'sidebar fixed top-0 left-0 h-full w-64 bg-card shadow-lg z-50 transform transition-transform duration-300 ease-in-out border-r',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b h-16">
            <div className="text-lg font-semibold font-headline text-foreground">Myanmar Creative Hub</div>
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-md hover:bg-muted transition-colors duration-200 lg:hidden"
              onClick={closeSidebar}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {MENU_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.auth && !user ? '#' : item.href}
                      onClick={() => handleLinkClick(item.href)}
                      className={cn(
                        'w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 group',
                        isActive
                          ? 'bg-primary/20 text-primary'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground',
                        item.auth && !user && 'cursor-pointer'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'w-5 h-5',
                          isActive
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {!user && (
            <div className="p-4 border-t space-y-2">
              <Button
                onClick={() => {
                  openLogin();
                  closeSidebar();
                }}
                className="w-full"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  openSignup();
                  closeSidebar();
                }}
                className="w-full"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Signup
              </Button>
            </div>
          )}
        </div>
      </aside>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
}
