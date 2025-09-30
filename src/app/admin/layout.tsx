import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/sidebar';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}
