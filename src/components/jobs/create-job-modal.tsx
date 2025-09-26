'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/components/providers/app-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X, Plus, Trash2, CalendarIcon } from 'lucide-react';
import { PORTFOLIO_CATEGORIES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';


const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  description: z.string().min(20, 'Description must be at least 20 characters long'),
  category: z.string().min(1, 'Please select a category'),
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
  budget: z.coerce.number().min(1, 'Budget must be greater than 0'),
  location: z.string().min(3, 'Location is required'),
  notes: z.string().optional(),
  deadline: z.object({ from: z.date(), to: z.date() }).optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function CreateJobModal() {
  const { activeModal, closeModal, modalData } = useApp();
  const { addJob } = useAuth();
  const { toast } = useToast();
  
  const [newSkill, setNewSkill] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      skills: [],
      budget: 0,
      location: '',
      notes: '',
    },
  });

  const skillsValue = watch('skills');
  const deadlineValue = watch('deadline');

  const handleClose = () => {
    reset();
    closeModal();
  }

  const onSubmit = (data: JobFormData) => {
    addJob(data);
    toast({ title: 'Job Posted!', description: 'Your new job opportunity has been posted.' });
    handleClose();
  };
  
  const handleAddSkill = () => {
    if (newSkill.trim() && !skillsValue.includes(newSkill.trim())) {
      setValue('skills', [...skillsValue, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setValue('skills', skillsValue.filter(skill => skill !== skillToRemove));
  };


  if (activeModal !== 'createJob') return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl relative animate-in fade-in-0 zoom-in-95">
        <div className="flex flex-col max-h-[90vh]">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold font-headline text-card-foreground">Create Job Posting</h2>
            <Button variant="ghost" size="icon" onClick={handleClose} className="p-2 hover:bg-muted rounded-full">
              <X className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => <Input id="title" placeholder="e.g., Logo Designer for a Cafe" {...field} />}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => <Textarea id="description" placeholder="Describe the job requirements in detail..." {...field} rows={5} />}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                   <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {PORTFOLIO_CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="budget">Estimated Budget ($)</Label>
                    <Controller
                    name="budget"
                    control={control}
                    render={({ field }) => <Input id="budget" type="number" placeholder="e.g., 500" {...field} />}
                    />
                    {errors.budget && <p className="text-sm text-destructive">{errors.budget.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Required Skills</Label>
                <div className="flex gap-2">
                    <Input 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a required skill (e.g., Figma)"
                        onKeyDown={(e) => { if(e.key === 'Enter'){ e.preventDefault(); handleAddSkill(); }}}
                    />
                    <Button type="button" onClick={handleAddSkill}><Plus className="w-4 h-4 mr-2" /> Add</Button>
                </div>
                {errors.skills && <p className="text-sm text-destructive">{errors.skills.message}</p>}
                {skillsValue.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {skillsValue.map(skill => (
                            <div key={skill} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                                <span className="text-sm text-muted-foreground">{skill}</span>
                                <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-muted-foreground hover:text-destructive">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
              </div>
              
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Controller
                    name="location"
                    control={control}
                    render={({ field }) => <Input id="location" placeholder="e.g., Yangon, Myanmar (Remote)" {...field} />}
                    />
                    {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline (Optional)</Label>
                    <Controller
                      name="deadline"
                      control={control}
                      render={({ field }) => (
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value?.from ? (
                                    field.value.to ? (
                                        <>
                                        {format(field.value.from, "LLL dd, y")} -{" "}
                                        {format(field.value.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(field.value.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={field.value?.from}
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                      )}
                    />
                </div>
              </div>


              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => <Textarea id="notes" placeholder="Add any additional notes or requirements for this job..." {...field} rows={3} />}
                />
              </div>
            </div>
            
            <div className="flex justify-end p-6 border-t bg-muted/50">
              <Button type="submit">Post Job</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
