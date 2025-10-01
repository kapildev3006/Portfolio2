
'use client';

import { Bell, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '../ui/sidebar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

type HeaderData = {
    name: string;
    imageUrl: string;
}

const defaultHeaderData: HeaderData = {
  name: 'Admin',
  imageUrl: '',
};

export default function AdminHeader() {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchHeaderData() {
      try {
        const docRef = doc(db, 'portfolio', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHeaderData({
            name: data.hero?.name || defaultHeaderData.name,
            imageUrl: data.hero?.imageUrl || defaultHeaderData.imageUrl,
          });
        } else {
          setHeaderData(defaultHeaderData);
        }
      } catch (error) {
        console.error("Error fetching header data:", error);
        setHeaderData(defaultHeaderData);
      } finally {
        setLoading(false);
      }
    }
    fetchHeaderData();
  }, []);
  
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  const fallback = headerData?.name ? headerData.name.substring(0, 2).toUpperCase() : 'AD';

  return (
    <header className="flex h-20 items-center justify-between border-b border-sidebar-border bg-card px-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="hidden md:block">
            {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
            ) : (
                <>
                    <h2 className="text-lg font-semibold">Welcome back!</h2>
                    <p className="text-sm text-muted-foreground">{headerData?.name}</p>
                </>
            )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="relative rounded-full">
          <Link href="/admin/notifications">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute right-1 top-1 block h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background"></span>
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 rounded-full p-0.5 pr-2">
                {loading ? (
                    <Skeleton className="h-9 w-9 rounded-full" />
                ) : (
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={headerData?.imageUrl} alt={headerData?.name} />
                        <AvatarFallback>{fallback}</AvatarFallback>
                    </Avatar>
                )}
               <div className="hidden text-left md:block">
                  {loading ? (
                      <Skeleton className="h-4 w-20" />
                  ) : (
                      <p className="text-sm font-medium">{headerData?.name}</p>
                  )}
               </div>
              <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
