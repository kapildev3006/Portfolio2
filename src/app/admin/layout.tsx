
'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { PortfolioDataProvider } from '@/context/PortfolioDataProvider';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <PortfolioDataProvider>
      <SidebarProvider defaultOpen={true}>
          {children}
      </SidebarProvider>
    </PortfolioDataProvider>
  );
}
