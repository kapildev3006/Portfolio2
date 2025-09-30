
'use client';

import { Bell, ChevronDown } from 'lucide-react';
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
import { portfolioData } from '@/lib/portfolio-data';

export default function AdminHeader() {
  const { name, imageUrl } = portfolioData.hero;
  const fallback = name.substring(0, 2).toUpperCase();

  return (
    <header className="flex h-20 items-center justify-between border-b border-sidebar-border bg-card px-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="hidden md:block">
            <h2 className="text-lg font-semibold">Welcome back!</h2>
            <p className="text-sm text-muted-foreground">{name}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="relative rounded-full">
          <Link href="/admin/contacts">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            {/* This is a static indicator. In a real app, you'd drive this with state. */}
            <span className="absolute right-1 top-1 block h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background"></span>
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 rounded-full p-0.5 pr-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={imageUrl} alt={name} />
                <AvatarFallback>{fallback}</AvatarFallback>
              </Avatar>
               <div className="hidden text-left md:block">
                  <p className="text-sm font-medium">{name}</p>
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
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
