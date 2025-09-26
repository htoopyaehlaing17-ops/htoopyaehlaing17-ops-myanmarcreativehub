
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JobsPage() {
    const sectionContent = {
        title: 'Jobs',
        description: 'Find your next creative opportunity.',
        content: 'Browse job postings from companies looking for creative talent. Post your own job listings to find the perfect freelancer for your project.'
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 font-headline text-foreground">{sectionContent.title}</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{sectionContent.description}</p>
            </div>
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Under Construction</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-card-foreground">{sectionContent.content}</p>
                </CardContent>
            </Card>
        </div>
    );
}
