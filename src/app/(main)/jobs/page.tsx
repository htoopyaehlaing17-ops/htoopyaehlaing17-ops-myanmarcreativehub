'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useApp } from '@/components/providers/app-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Plus, MapPin, DollarSign, FileText } from 'lucide-react';
import type { Job } from '@/lib/types';
import Link from 'next/link';

export default function JobsPage() {
  const { user, jobs } = useAuth();
  const { openModal } = useApp();

  const sectionContent = {
    title: 'Jobs',
    description: 'Find your next creative opportunity.',
  };

  const handleCreateJob = () => {
    openModal('createJob');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2 font-headline text-foreground">
          {sectionContent.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {sectionContent.description}
        </p>
      </div>

      {user && (
        <div className="text-center">
          <Button onClick={handleCreateJob}>
            <Plus className="w-4 h-4 mr-2" />
            Create Job Posting
          </Button>
        </div>
      )}

      {jobs.length > 0 ? (
        <div className="space-y-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
               <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between">
                    <div>
                        <Link href="#">
                            <h3 className="text-xl font-bold text-foreground hover:text-primary transition-colors">{job.title}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">Posted by a client</p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-left sm:text-right">
                        <p className="text-lg font-bold text-foreground">${job.budget}</p>
                        <p className="text-sm text-muted-foreground">Estimated Budget</p>
                    </div>
                </div>
                
                <p className="text-foreground/80 my-4">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                </div>

                {job.notes && (
                  <Card className="bg-muted/50 border-dashed mb-4">
                    <CardHeader className="flex-row items-center gap-3 space-y-0 p-4">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <CardTitle className="text-base font-semibold">Additional Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">{job.notes}</p>
                    </CardContent>
                  </Card>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-muted-foreground border-t pt-4">
                   <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                   </div>
                   <div className="mt-2 sm:mt-0">
                        <Button asChild>
                            <Link href="#">View & Apply</Link>
                        </Button>
                   </div>
                </div>
               </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
            <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-card-foreground">
              No job opportunities posted yet. Check back soon!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
