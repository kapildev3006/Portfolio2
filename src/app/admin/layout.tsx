
'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/sidebar';
import useAuth from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { PortfolioDataProvider } from '@/context/PortfolioDataProvider';

export default function AdminLayout({
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
    <PortfolioDataProvider>
      <SidebarProvider defaultOpen={true}>
        <AdminSidebar />
        <main className="flex-1">{children}</main>
      </SidebarProvider>
    </PortfolioDataProvider>
  );
}
