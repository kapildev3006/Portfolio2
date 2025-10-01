'use client';

import AdminSidebar from '@/components/admin/sidebar';
import useAuth from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import AdminHeader from '@/components/admin/header';
import { PortfolioDataProvider } from '@/context/PortfolioDataProvider';
import { SidebarProvider } from '@/components/ui/sidebar';

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
       <div className="flex min-h-screen items-center justify-center bg-background">
         <Loader2 className="h-10 w-10 animate-spin text-primary" />
       </div>
    );
  }

  return (
    <SidebarProvider>
        <PortfolioDataProvider>
            <AdminSidebar />
            <main className="flex-1 md:ml-[var(--sidebar-width)] group-data-[collapsible=icon]/sidebar-wrapper:md:ml-[var(--sidebar-width-icon)] transition-all duration-200 ease-linear">
              <AdminHeader />
              {children}
            </main>
        </PortfolioDataProvider>
    </SidebarProvider>
  );
}
