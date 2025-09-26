'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useApp } from '@/components/providers/app-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EditSkillsModal() {
  const { activeModal, closeModal } = useApp();
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (profile) {
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
      updateProfile({ ...profile, skills });
      toast({ title: 'Skills Updated', description: 'Your skills have been successfully updated.' });
      closeModal();
    }
  };

  if (activeModal !== 'editSkills') return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-lg relative animate-in fade-in-0 zoom-in-95">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold font-headline text-card-foreground">Edit Skills</h2>
          <Button variant="ghost" size="icon" onClick={closeModal} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
        <div className="p-6 space-y-4">
            <div className="flex gap-2">
                <Input 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a new skill (e.g., Figma)"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <Button onClick={handleAddSkill}><Plus className="w-4 h-4 mr-2" /> Add</Button>
            </div>
            <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Your Skills:</p>
                {skills.length > 0 ? (
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
                ) : (
                    <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
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
