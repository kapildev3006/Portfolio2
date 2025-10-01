
'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/sidebar';
import useAuth from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function AdminDashboardSkeleton() {
  return (
    <div className="flex h-screen w-full">
      <div className="w-64 bg-card p-4">
        <div className="flex items-center gap-3 p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="mt-4 space-y-2 p-4">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </div>
      <div className="flex-1">
        <header className="flex h-20 items-center justify-between border-b border-border bg-card px-8">
            <Skeleton className="h-8 w-48" />
            <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-9 w-32 rounded-full" />
            </div>
        </header>
        <main className="p-8">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
        </main>
      </div>
    </div>
  );
}


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
    return <AdminDashboardSkeleton />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}
