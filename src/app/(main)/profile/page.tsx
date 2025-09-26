'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useApp } from '@/components/providers/app-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit3, Mail, Phone, MapPin, Calendar, Plus, Grid3X3, LogIn, Eye, Trash2, Globe, Lock, Heart, User } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, profile, portfolios, openLogin } = useAuth();
  const { openModal } = useApp();
  
  useEffect(() => {
    if (!user) {
        // In a real app with server-side auth, middleware would handle this redirect.
        // openLogin(); 
    }
  }, [user, openLogin]);

  if (!user || !profile) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Please Login</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          You need to be logged in to view your profile.
        </p>
        <Button onClick={openLogin}>
          <LogIn className="w-5 h-5 mr-2" />
          Login
        </Button>
      </div>
    );
  }
  
  const userPortfolios = portfolios.filter(p => p.userId === user.id);

  const handleNewProject = () => {
    openModal('uploadPortfolio');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8">
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold text-foreground font-headline">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.title}</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                {profile.skills.map((skill, index) => (
                  <div key={index} className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-muted-foreground" /><span className="text-foreground">{profile.email}</span></div>
            <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-muted-foreground" /><span className="text-foreground">{profile.phone || 'Not provided'}</span></div>
            <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-muted-foreground" /><span className="text-foreground">{profile.location || 'Not provided'}</span></div>
            <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-muted-foreground" /><span className="text-foreground">Member since {profile.memberSince}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profile Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg"><div className="text-2xl font-bold text-foreground">{userPortfolios.filter(p => p.isPublic).length}</div><div className="text-sm text-muted-foreground">Public Projects</div></div>
              <div className="text-center p-4 bg-muted/50 rounded-lg"><div className="text-2xl font-bold text-foreground">4.8</div><div className="text-sm text-muted-foreground">Average Rating</div></div>
              <div className="text-center p-4 bg-muted/50 rounded-lg"><div className="text-2xl font-bold text-foreground">18</div><div className="text-sm text-muted-foreground">Active Clients</div></div>
              <div className="text-center p-4 bg-muted/50 rounded-lg"><div className="text-2xl font-bold text-foreground">98%</div><div className="text-sm text-muted-foreground">Job Success</div></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>About Me</CardTitle></CardHeader>
        <CardContent><p className="text-foreground leading-relaxed">{profile.bio}</p></CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Projects</CardTitle>
          <Button onClick={handleNewProject}><Plus className="w-4 h-4 mr-2" />New Project</Button>
        </CardHeader>
        <CardContent>
          {userPortfolios.length > 0 ? (
            <div className="space-y-6">
              {userPortfolios.map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  <div className="relative">
                    <Image src={p.coverImage} alt={p.title} width={800} height={450} className="w-full h-64 object-cover" />
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm flex items-center gap-2"><Eye className="w-4 h-4" />{p.views}</div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Button size="icon" variant="secondary"><Edit3 className="w-4 h-4" /></Button>
                      <Button size="icon" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                    {p.featured && <div className="absolute bottom-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded text-sm font-medium">Featured</div>}
                    <div className="absolute top-4 right-24 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      {p.isPublic ? <><Globe className="w-3 h-3" />Public</> : <><Lock className="w-3 h-3" />Private</>}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-foreground">{p.title}</h3>
                      <Button variant="ghost" size="icon"><Heart className="w-5 h-5 text-muted-foreground" /></Button>
                    </div>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{p.description}</p>
                    <div className="mb-4"><span className="text-sm text-muted-foreground">Category</span><p className="font-medium text-foreground">{p.category}</p></div>
                    <div className="mt-4 pt-4 border-t"><span className="text-sm text-muted-foreground">{p.images.length} project image{p.images.length !== 1 ? 's' : ''}</span></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Grid3X3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">Start showcasing your creative work by creating your first project.</p>
              <Button onClick={handleNewProject}><Plus className="w-5 h-5 mr-2" />Create Your First Project</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
