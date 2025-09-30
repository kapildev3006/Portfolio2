
'use client';

import {
  BarChart2,
  Bell,
  Briefcase,
  Cog,
  Contact,
  Home,
  LayoutGrid,
  MessageSquare,
  UserCircle,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';

const sidebarNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/about', label: 'About', icon: UserCircle },
  { href: '/admin/stats', label: 'Stats', icon: BarChart2 },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/chat', label: 'Chat', icon: MessageSquare },
  { href: '/admin/contacts', label: 'Contacts', icon: Contact },
  { href: '/admin/profile', label: 'Profile', icon: UserCircle },
  { href: '/admin/settings', label: 'Settings', icon: Cog },
];

type SidebarData = {
    name: string;
    imageUrl: string;
}

const defaultSidebarData: SidebarData = {
  name: 'Admin',
  imageUrl: '',
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSidebarData() {
      try {
        const docRef = doc(db, 'portfolio', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSidebarData({
            name: data.hero?.name || defaultSidebarData.name,
            imageUrl: data.hero?.imageUrl || defaultSidebarData.imageUrl,
          });
        } else {
           setSidebarData(defaultSidebarData);
        }
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
        setSidebarData(defaultSidebarData);
      } finally {
        setLoading(false);
      }
    }
    fetchSidebarData();
  }, []);

  const fallback = sidebarData?.name ? sidebarData.name.substring(0, 2).toUpperCase() : "AD";

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-4">
          {loading ? (
             <Skeleton className="h-12 w-12 rounded-full" />
          ) : (
            <Avatar className="h-12 w-12">
                <AvatarImage src={sidebarData?.imageUrl} alt={sidebarData?.name} />
                <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col">
              <span className="text-lg font-bold text-sidebar-foreground">Admin Panel</span>
              {loading ? (
                <Skeleton className="h-4 w-24 mt-1" />
              ) : (
                <span className="text-sm text-muted-foreground/80">{sidebarData?.name}</span>
              )}
          </div>
        </div>
      </SidebarHeader>

      <Separator className="my-2 bg-sidebar-border/50"/>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {sidebarNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  className="group rounded-lg text-sidebar-foreground/80 transition-colors hover:bg-primary/10 hover:text-sidebar-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                >
                  <div className="absolute left-0 h-6 w-1 rounded-r-full bg-transparent transition-all group-hover:bg-primary/80 data-[active=true]:bg-primary"></div>
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <Separator className="my-2 bg-sidebar-border/50"/>

      <SidebarFooter className="p-4">
        <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/">
                <SidebarMenuButton className="rounded-lg text-sidebar-foreground/80 transition-colors hover:bg-primary/10 hover:text-sidebar-foreground">
                  <Home />
                  <span className="font-medium">Back to Website</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
