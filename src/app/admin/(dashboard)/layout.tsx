'use client';

import useAuth from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import ClientProviders from './client-providers';

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
      <ClientProviders>
        <div className="group/sidebar-wrapper flex min-h-dvh w-full">
            <main className="flex-1 transition-all duration-200 ease-linear md:ml-[var(--sidebar-width)] group-data-[collapsible=icon]/sidebar-wrapper:md:ml-[var(--sidebar-width-icon)]">
              {children}
            </main>
        </div>
      </ClientProviders>
    </SidebarProvider>
  );
}
