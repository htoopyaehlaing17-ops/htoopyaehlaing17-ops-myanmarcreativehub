'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { jobs, users, profiles } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, DollarSign, FileText, CalendarClock, Briefcase, Mail, Send } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id;
  const job = jobs.find(j => j.id === Number(id));
  const { toast } = useToast();

  const handleApply = () => {
    toast({
        title: "Application Sent!",
        description: "Your application has been submitted to the client.",
    });
  }

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
                         <Button size="lg" className="w-full sm:w-auto" onClick={handleApply}>
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
  );
}
