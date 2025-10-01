
'use client';

import AdminSidebar from '@/components/admin/sidebar';
import { PortfolioDataProvider } from '@/context/PortfolioDataProvider';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <PortfolioDataProvider>
        <AdminSidebar />
        <main className="flex-1 md:ml-[var(--sidebar-width)] group-data-[collapsible=icon]/sidebar-wrapper:md:ml-[var(--sidebar-width-icon)] transition-all duration-200 ease-linear">
          {children}
        </main>
    </PortfolioDataProvider>
  );
}
