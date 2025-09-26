'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useApp } from '@/components/providers/app-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EditProfileModal() {
  const { activeModal, closeModal } = useApp();
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setTitle(profile.title);
      setSkills(profile.skills);
    }
  }, [profile]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = () => {
    if (profile) {
      updateProfile({ ...profile, name, title, skills });
      toast({ title: 'Profile Updated', description: 'Your profile details have been successfully updated.' });
      closeModal();
    }
  };

  if (activeModal !== 'editProfile') return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-lg relative animate-in fade-in-0 zoom-in-95">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold font-headline text-card-foreground">Edit Profile</h2>
          <Button variant="ghost" size="icon" onClick={closeModal} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
        <div className="p-6 space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior UI/UX Designer"/>
            </div>
            <div className="space-y-4">
                <Label>Skills</Label>
                <div className="flex gap-2">
                    <Input 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a new skill (e.g., Figma)"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <Button onClick={handleAddSkill}><Plus className="w-4 h-4 mr-2" /> Add</Button>
                </div>
                {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <div key={skill} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                                <span className="text-sm text-muted-foreground">{skill}</span>
                                <button onClick={() => handleRemoveSkill(skill)} className="text-muted-foreground hover:text-destructive">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        <div className="flex justify-end p-6 border-t bg-muted/50">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
