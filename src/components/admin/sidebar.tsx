'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BarChart, Briefcase, Contact, FolderKanban, LayoutGrid, MessageSquare, MessagesSquare, User } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
    { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { name: 'Services', href: '/admin/services', icon: Briefcase },
    { name: 'About', href: '/admin/about', icon: User },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
];

const secondaryNavItems = [
    { name: 'Stats', href: '/admin/stats', icon: BarChart },
    { name: 'Chat', href: '/admin/chat', icon: MessagesSquare },
    { name: 'Contacts', href: '/admin/contacts', icon: Contact },
]

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground lg:flex">
            <div className="flex h-16 items-center gap-3 border-b border-border px-6">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>KD</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-semibold">Admin Panel</p>
                    <p className="text-xs text-muted-foreground">Kapil Dev</p>
                </div>
            </div>
            <div className="flex flex-1 flex-col justify-between overflow-y-auto">
                <nav className="flex-1 space-y-2 p-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <Button
                                    variant={isActive ? 'secondary' : 'ghost'}
                                    className={cn(
                                        'w-full justify-start gap-2',
                                        isActive && 'sidebar-gradient font-semibold text-sidebar-accent-foreground'
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
                <nav className="space-y-2 p-4">
                     {secondaryNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <Button
                                    variant={isActive ? 'secondary' : 'ghost'}
                                    className={cn(
                                        'w-full justify-start gap-2',
                                        isActive && 'sidebar-gradient font-semibold text-sidebar-accent-foreground'
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
