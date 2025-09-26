
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FreelancersPage() {
    const sectionContent = {
        title: 'Freelancers',
        description: 'Browse our talented community of creative professionals.',
        content: 'Find skilled freelancers in design, development, writing, photography, and more. Connect directly with professionals who can bring your vision to life.'
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
