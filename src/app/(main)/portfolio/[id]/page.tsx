'use client';

import { useParams } from 'next/navigation';
import { portfolios, profiles, users } from '@/lib/data';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Eye, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function PortfolioDetailPage() {
  const params = useParams();
  const id = params.id;
  const portfolio = portfolios.find(p => p.id === Number(id));

  if (!portfolio) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="text-muted-foreground">This project might have been removed or the URL is incorrect.</p>
        <Button asChild className="mt-4">
          <Link href="/portfolio">Back to Showcase</Link>
        </Button>
      </div>
    );
  }

  const author = users.find(u => u.id === portfolio.userId);
  const authorProfile = profiles.find(p => p.userId === portfolio.userId);

  return (
    <div className="max-w-5xl mx-auto">
       <Button asChild variant="ghost" className="mb-4">
        <Link href="/portfolio">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Showcase
        </Link>
      </Button>

      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-5 gap-0">
          <div className="md:col-span-3">
            <Image
              src={portfolio.coverImage}
              alt={portfolio.title}
              width={1200}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-2 p-6 flex flex-col">
            <div className="flex-grow">
                 {author && authorProfile && (
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar>
                            <AvatarImage src={authorProfile.avatar || undefined} alt={author.name} />
                            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold text-foreground">{author.name}</p>
                            <p className="text-sm text-muted-foreground">{authorProfile.title}</p>
                        </div>
                    </div>
                )}
              <h1 className="text-3xl font-bold font-headline text-foreground mb-2">{portfolio.title}</h1>
              <p className="text-muted-foreground mb-4">{portfolio.description}</p>
              <Badge variant="secondary">{portfolio.category}</Badge>
            </div>
            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium text-sm">{portfolio.likes}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-5 h-5" />
                   <span className="font-medium text-sm">{portfolio.views}</span>
                </div>
              </div>
              <Button variant="outline"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="my-8">
        <h2 className="text-2xl font-bold font-headline mb-4">Project Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.images.map((img, index) => (
                <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                     <Image
                        src={img}
                        alt={`${portfolio.title} image ${index + 1}`}
                        fill
                        className="object-cover"
                    />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
