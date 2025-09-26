'use client';

import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, LogIn } from "lucide-react";

export default function SettingsPage() {
    const { user, openLogin } = useAuth();

    const sectionContent = {
        title: 'Settings',
        description: 'Configure your platform preferences.',
        content: 'Customize your notification settings, privacy preferences, and account security options.'
    };
    
    if (!user) {
        return (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Access Denied</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You need to be logged in to access settings.
            </p>
            <Button onClick={openLogin}>
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </Button>
          </div>
        );
    }

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
