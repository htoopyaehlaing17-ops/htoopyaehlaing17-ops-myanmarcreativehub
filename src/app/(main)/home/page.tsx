import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const sectionContent = {
      home: {
        title: 'Home',
        description: 'Welcome to Myanmar Creative Hub - your gateway to creative talent and opportunities.',
        content: 'Explore our platform to connect with freelancers, browse creative work, and discover new opportunities.'
      }
  };

  const currentSection = sectionContent.home;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4 font-headline text-foreground">{currentSection.title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{currentSection.description}</p>
      </div>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-card-foreground">{currentSection.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
