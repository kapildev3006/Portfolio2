
'use client';

import AdminHeader from '@/components/admin/header';
import AdminSidebar from '@/components/admin/sidebar';
import useAuth from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { PortfolioDataProvider } from '@/context/PortfolioDataProvider';

export default function ClientProviders({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-1 min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PortfolioDataProvider>
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </PortfolioDataProvider>
  );
}
