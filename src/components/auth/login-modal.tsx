'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GoogleIcon from '@/components/icons/google-icon';

export default function LoginModal() {
  const { closeModal } = useApp();
  const { handleLogin, handleGoogleLogin, openSignup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleLogin(email, password);
    if (result?.error) {
      setError(result.error);
    } else {
      setError('');
      closeModal();
    }
  };

  const onSwitchToSignup = () => {
    closeModal();
    openSignup();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md relative animate-in fade-in-0 zoom-in-95">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-headline text-card-foreground">Login</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeModal}
              className="p-2 hover:bg-muted rounded-full"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>

          <form onSubmit={onLogin} className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full"
          >
            <GoogleIcon className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Don't have an account? <span className="font-semibold text-primary">Sign up</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
