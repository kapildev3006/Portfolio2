import type { Metadata } from 'next';
import AdminSidebar from '@/components/admin/sidebar';
import AdminHeader from '@/components/admin/header';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your portfolio content.',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark admin-body flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 bg-muted/30">{children}</main>
      </div>
    </div>
  );
}
