import AppLayout from "@/components/layout/app-layout";
import { AuthProvider } from "@/components/providers/auth-provider";
import UploadPortfolioModal from "@/components/portfolio/upload-portfolio-modal";
import EditProfileModal from "@/components/profile/edit-profile-modal";
import CreateJobModal from "@/components/jobs/create-job-modal";

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
          <EditProfileModal />
          <CreateJobModal />
        </AppLayout>
    </AuthProvider>
  );
}
