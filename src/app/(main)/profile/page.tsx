'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useApp } from '@/components/providers/app-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit3, Mail, Phone, MapPin, Calendar, Plus, Grid3X3, LogIn, Eye, Trash2, Globe, Lock, Heart, User, Save, X, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Portfolio } from '@/lib/types';


export default function ProfilePage() {
  const { user, profile, portfolios, openLogin, updateProfile, deletePortfolio } = useAuth();
  const { openModal } = useApp();
  const { toast } = useToast();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(profile?.bio || '');
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(null);
  
  useEffect(() => {
    if (!user) {
        // In a real app with server-side auth, middleware would handle this redirect.
        // openLogin(); 
    }
  }, [user, openLogin]);

  useEffect(() => {
    if (profile) {
      setEditedBio(profile.bio);
    }
  }, [profile]);


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

  const handleEditProject = (portfolio: Portfolio) => {
    openModal('uploadPortfolio', { portfolio });
  };
  
  const handleDeleteClick = (portfolio: Portfolio) => {
    setPortfolioToDelete(portfolio);
    setIsDeleteAlertOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (portfolioToDelete) {
      deletePortfolio(portfolioToDelete.id);
      toast({ title: "Project Deleted", description: `"${portfolioToDelete.title}" has been removed.` });
      setPortfolioToDelete(null);
      setIsDeleteAlertOpen(false);
    }
  };

  const handleSaveBio = () => {
    if (profile) {
      updateProfile({ ...profile, bio: editedBio });
      setIsEditingBio(false);
      toast({ title: 'Success', description: 'Your bio has been updated.' });
    }
  };

  const handleCancelEditBio = () => {
    setEditedBio(profile?.bio || '');
    setIsEditingBio(false);
  }

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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>About Me</CardTitle>
          {!isEditingBio && (
            <Button variant="ghost" size="icon" onClick={() => setIsEditingBio(true)}>
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditingBio ? (
            <div className="space-y-4">
              <Textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                rows={6}
                className="w-full"
                placeholder="Tell us about yourself..."
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={handleCancelEditBio}><X className="w-4 h-4 mr-2" />Cancel</Button>
                <Button onClick={handleSaveBio}><Save className="w-4 h-4 mr-2" />Save</Button>
              </div>
            </div>
          ) : (
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Projects</CardTitle>
          <Button onClick={handleNewProject}><Plus className="w-4 h-4 mr-2" />New Project</Button>
        </CardHeader>
        <CardContent>
          {userPortfolios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userPortfolios.map((p) => (
                <Card key={p.id} className="overflow-hidden flex flex-col">
                  <div className="relative">
                    <Image src={p.coverImage} alt={p.title} width={800} height={450} className="w-full h-48 object-cover" />
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                       <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleEditProject(p)}><Edit3 className="w-4 h-4" /></Button>
                       <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteClick(p)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                    {p.featured && <div className="absolute bottom-2 left-2 bg-accent text-accent-foreground px-2 py-0.5 rounded text-xs font-medium">Featured</div>}
                    <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
                      {p.isPublic ? <><Globe className="w-3 h-3" />Public</> : <><Lock className="w-3 h-3" />Private</>}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-foreground leading-tight">{p.title}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-medium">{p.likes}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3 flex-grow">{p.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-foreground">{p.category}</span>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Eye className="w-4 h-4" />{p.views}
                      </div>
                    </div>
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
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your project
              <span className="font-bold"> "{portfolioToDelete?.title}" </span> 
              and remove its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPortfolioToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    