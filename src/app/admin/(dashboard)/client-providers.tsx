
'use client';

import AdminHeader from '@/components/admin/header';
import type { ReactNode } from 'react';

export default function ClientProviders({ children }: { children: ReactNode }) {

  return (
      <div className="flex flex-1 flex-col min-h-0 transition-all duration-200 ease-linear md:ml-[var(--sidebar-width)] group-data-[collapsible=icon]/sidebar-wrapper:md:ml-[var(--sidebar-width-icon)]">
          <AdminHeader />
          <div className="flex-1 overflow-y-auto min-h-0">
              {children}
          </div>
      </div>
  );
}
