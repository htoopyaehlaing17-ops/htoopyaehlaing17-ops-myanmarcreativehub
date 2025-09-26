'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { jobs, users, profiles } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, DollarSign, FileText, CalendarClock, Briefcase, Mail, Send, X, Paperclip, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';


export default function JobDetailPage() {
  const params = useParams();
  const id = params.id;
  const job = jobs.find(j => j.id === Number(id));
  const { toast } = useToast();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState('');

  const handleApplyClick = () => {
    setIsApplyModalOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setResumeFileName(file.name);
    }
  };
  
  const handleRemoveFile = () => {
    setResumeFile(null);
    setResumeFileName('');
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  };

  const handleSubmitApplication = () => {
    // In a real application, you would handle the form submission,
    // upload the file, and save the application data.
    console.log({
      jobId: job?.id,
      coverLetter,
      resume: resumeFile,
    });

    toast({
      title: "Application Sent!",
      description: "Your application has been successfully submitted to the client.",
    });
    
    // Reset state and close modal
    setCoverLetter('');
    setResumeFile(null);
    setResumeFileName('');
    setIsApplyModalOpen(false);
  };

  if (!job) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Job not found</h1>
        <p className="text-muted-foreground">This job posting might have been removed or the URL is incorrect.</p>
        <Button asChild className="mt-4">
          <Link href="/jobs">Back to Jobs</Link>
        </Button>
      </div>
    );
  }

  const client = users.find(u => u.id === job.clientId);
  const clientProfile = profiles.find(p => p.userId === job.clientId);

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/jobs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all jobs
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
              <Card>
                  <CardHeader>
                      <Badge variant="secondary" className="w-fit mb-4">{job.category}</Badge>
                      <CardTitle className="text-3xl font-bold font-headline">{job.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground mb-6">{job.description}</p>
                      
                      <h3 className="font-bold text-lg mb-3">Required Skills</h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                          {job.skills.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)}
                      </div>
                      
                      {job.notes && (
                      <Card className="bg-muted/50 border-dashed mb-6">
                          <CardHeader className="flex-row items-center gap-3 space-y-0 p-4">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                              <CardTitle className="text-base font-semibold">Additional Notes</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                              <p className="text-sm text-muted-foreground">{job.notes}</p>
                          </CardContent>
                      </Card>
                      )}

                      <div className="border-t pt-6">
                           <Button size="lg" className="w-full sm:w-auto" onClick={handleApplyClick}>
                              <Send className="w-4 h-4 mr-2" />
                              Apply Now
                          </Button>
                      </div>
                  </CardContent>
              </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
              <Card>
                  <CardHeader className="flex-row items-center gap-3">
                      <DollarSign className="w-6 h-6 text-primary" />
                      <div>
                          <p className="text-2xl font-bold">${job.budget}</p>
                          <p className="text-sm text-muted-foreground">Estimated Budget</p>
                      </div>
                  </CardHeader>
              </Card>

              <Card>
                  <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Job Details</CardTitle>
                  </CardHeader>
                   <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{job.location}</span>
                      </div>
                      {job.deadline && (
                          <div className="flex items-center gap-3">
                              <CalendarClock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-foreground">Apply before {format(job.deadline, "LLL dd, y")}</span>
                          </div>
                      )}
                      <div className="flex items-center gap-3">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">Full-time / Contract</span>
                      </div>
                  </CardContent>
              </Card>

               {client && clientProfile && (
                  <Card>
                      <CardHeader className="pb-2">
                          <CardTitle className="text-lg">About the Client</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="flex items-center gap-3 mb-4">
                              <Avatar>
                                  <AvatarImage src={clientProfile.avatar || undefined} alt={client.name} />
                                  <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                  <p className="font-bold text-foreground">{client.name}</p>
                                  <p className="text-sm text-muted-foreground">Hiring since {clientProfile.memberSince}</p>
                              </div>
                          </div>
                          <Button variant="outline" className="w-full">
                              <Mail className="w-4 h-4 mr-2" />
                              Contact Client
                          </Button>
                      </CardContent>
                  </Card>
               )}
          </div>
        </div>
      </div>
      
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">Apply for: {job.title}</DialogTitle>
            <DialogDescription>
              Submit your application to the client. Include a cover letter and your resume.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cover-letter">Cover Letter</Label>
              <Textarea
                id="cover-letter"
                placeholder="Write a message to the client explaining why you're a good fit for this role..."
                rows={8}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resume-upload">Attach Resume/CV (PDF)</Label>
               <Input id="resume-upload" type="file" accept=".pdf" onChange={handleFileChange} className="hidden"/>
               <label 
                 htmlFor="resume-upload"
                 className="cursor-pointer border-2 border-dashed border-muted hover:border-primary rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground transition-colors"
               >
                 {resumeFileName ? (
                   <div className="flex items-center gap-3 text-foreground font-medium">
                     <Paperclip className="w-5 h-5"/>
                     <span>{resumeFileName}</span>
                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.preventDefault(); handleRemoveFile(); }}>
                       <X className="w-4 h-4" />
                     </Button>
                   </div>
                 ) : (
                   <>
                    <Upload className="w-8 h-8 mb-2" />
                    <span>Click to upload your resume</span>
                    <span className="text-xs mt-1">PDF format only</span>
                   </>
                 )}
               </label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSubmitApplication} disabled={!coverLetter}>
              <Send className="w-4 h-4 mr-2" />
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
