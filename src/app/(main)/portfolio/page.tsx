'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Portfolio } from '@/lib/types';

export default function PortfolioPage() {
    const { portfolios, updatePortfolio } = useAuth();
    const { toast } = useToast();
    const publicPortfolios = portfolios.filter(p => p.isPublic);
    const [likedPortfolios, setLikedPortfolios] = useState<Set<number>>(new Set());

    const sectionContent = {
        title: 'Portfolio Showcase',
        description: 'Explore creative work from our talented community.',
    };

    const handleLikeClick = (portfolio: Portfolio) => {
        const portfolioId = portfolio.id;
        const isLiked = likedPortfolios.has(portfolioId);
        
        let updatedPortfolio: Portfolio;

        setLikedPortfolios(prev => {
            const newLiked = new Set(prev);
            if (newLiked.has(portfolioId)) {
                newLiked.delete(portfolioId);
                toast({ title: 'Unliked', description: 'Project removed from your likes.' });
                updatedPortfolio = { ...portfolio, likes: portfolio.likes - 1 };
            } else {
                newLiked.add(portfolioId);
                toast({ title: 'Liked!', description: 'Project added to your likes.' });
                updatedPortfolio = { ...portfolio, likes: portfolio.likes + 1 };
            }
            updatePortfolio(updatedPortfolio);
            return newLiked;
        });
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 font-headline text-foreground">{sectionContent.title}</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{sectionContent.description}</p>
            </div>
            
            {publicPortfolios.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {publicPortfolios.map((p) => {
                        const isLiked = likedPortfolios.has(p.id);
                        return (
                            <Card key={p.id} className="overflow-hidden group">
                                <div className="relative">
                                    <Image src={p.coverImage} alt={p.title} width={600} height={400} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
                                    <div className="absolute top-3 right-3 flex items-center gap-2">
                                        <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                                            <Eye className="w-4 h-4 mr-1.5" />
                                            {p.views}
                                        </Badge>
                                    </div>
                                    {p.featured && (
                                        <Badge className="absolute bottom-3 left-3" variant="default">Featured</Badge>
                                    )}
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-bold text-foreground mb-2 truncate">{p.title}</h3>
                                    <p className="text-muted-foreground text-sm mb-3 h-10 overflow-hidden">{p.description}</p>
                                    <div className="flex justify-between items-center pt-3 border-t">
                                         <Badge variant="outline">{p.category}</Badge>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className={cn("text-muted-foreground hover:text-destructive h-8 w-8", isLiked && "text-destructive")}
                                                onClick={() => handleLikeClick(p)}
                                            >
                                                <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                                            </Button>
                                            <span className="text-sm font-medium">{p.likes}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                 <Card className="max-w-3xl mx-auto">
                    <CardContent className="p-10 text-center">
                    <p className="text-card-foreground">No public projects available to display yet. Check back soon!</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
