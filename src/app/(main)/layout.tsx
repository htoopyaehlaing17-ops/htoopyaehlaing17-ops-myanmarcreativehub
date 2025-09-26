import AppLayout from "@/components/layout/app-layout";
import { AuthProvider } from "@/components/providers/auth-provider";
import { portfolios } from "@/lib/data";
import { profiles } from "@/lib/data";
import { users } from "@/lib/data";
import UploadPortfolioModal from "@/components/portfolio/upload-portfolio-modal";
import EditSkillsModal from "@/components/profile/edit-skills-modal";

// This is a mock layout, in a real app data would be fetched from a server
// and passed down, and user session would be managed with server-side logic.
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = null; // Mock: in real app, this would be from getSessionUser()

  return (
    <AuthProvider>
        <AppLayout user={user}>
          {children}
          <UploadPortfolioModal />
          <EditSkillsModal />
        </AppLayout>
    </AuthProvider>
  );
}
