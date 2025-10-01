
'use client';

import AdminHeader from '@/components/admin/header';
import AdminSidebar from '@/components/admin/sidebar';
import { PortfolioDataProvider } from '@/context/PortfolioDataProvider';
import { ReactNode } from 'react';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <PortfolioDataProvider>
      <AdminSidebar />
      <AdminHeader />
      {children}
    </PortfolioDataProvider>
  );
}
