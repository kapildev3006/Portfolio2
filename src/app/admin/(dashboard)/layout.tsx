
'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import ClientProviders from './client-providers';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="group/sidebar-wrapper flex min-h-dvh w-full">
        <main className="flex-1 transition-all duration-200 ease-linear md:ml-[var(--sidebar-width)] group-data-[collapsible=icon]/sidebar-wrapper:md:ml-[var(--sidebar-width-icon)]">
          <ClientProviders>{children}</ClientProviders>
        </main>
      </div>
    </SidebarProvider>
  );
}
