
'use client';

import { SidebarProvider } from '@/components/ui/sidebar';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <SidebarProvider defaultOpen={true}>
          {children}
      </SidebarProvider>
  );
}
