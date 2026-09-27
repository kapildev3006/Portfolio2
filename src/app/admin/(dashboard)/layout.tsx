
'use client';

import AdminSidebar from '@/components/admin/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import ClientProviders from './client-providers';
import useAuth from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { PortfolioDataProvider } from '@/context/PortfolioDataProvider';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PortfolioDataProvider>
      <SidebarProvider>
        <div className="group/sidebar-wrapper flex min-h-dvh w-full bg-muted/40 relative">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0 min-h-dvh">
            <main className="flex-1 flex flex-col min-h-0">
              <ClientProviders>
                {children}
              </ClientProviders>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </PortfolioDataProvider>
  );
}
