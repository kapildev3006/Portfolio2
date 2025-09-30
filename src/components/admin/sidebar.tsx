'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  BarChart2,
  Briefcase,
  Cog,
  Contact,
  Home,
  LayoutGrid,
  MessageSquare,
  UserCircle,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';

const sidebarNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/services', label: 'Services', icon: Cog },
  { href: '/admin/about', label: 'About', icon: UserCircle },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/admin/stats', label: 'Stats', icon: BarChart2 },
  { href: '/admin/chat', label: 'Chat', icon: MessageSquare },
  { href: '/admin/contacts', label: 'Contacts', icon: Contact },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-10 w-10">
              <AvatarImage src="https://i.pravatar.cc/150?u=rohit" alt="Rohit Senger" />
              <AvatarFallback>RS</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
              <span className="text-lg font-semibold text-sidebar-foreground">Admin Panel</span>
              <span className="text-sm text-muted-foreground">Rohit Senger</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {sidebarNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  className="sidebar-gradient data-[active=true]:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent"
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <Separator />

      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" legacyBehavior passHref>
                <SidebarMenuButton>
                  <Home />
                  <span>Back to Website</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
