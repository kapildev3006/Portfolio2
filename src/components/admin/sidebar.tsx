'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BarChart, Briefcase, Contact, FolderKanban, LayoutGrid, MessageSquare, MessagesSquare, Settings, User } from 'lucide-react';
import { portfolioData } from '@/lib/portfolio-data';

const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
    { name: 'Projects', href: '#', icon: FolderKanban },
    { name: 'Services', href: '#', icon: Briefcase },
    { name: 'About', href: '#', icon: User },
    { name: 'Testimonials', href: '#', icon: MessageSquare },
];

const secondaryNavItems = [
    { name: 'Stats', href: '#', icon: BarChart },
    { name: 'Chat', href: '#', icon: MessagesSquare },
    { name: 'Contacts', href: '#', icon: Contact },
]

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-64 flex-col border-r border-border bg-card lg:flex">
            <div className="flex h-16 items-center gap-3 border-b border-border px-6">
                 <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold text-gradient">
                    <span>{portfolioData.hero.name.charAt(0)}</span>
                </Link>
                <div>
                    <p className="text-sm font-semibold">{portfolioData.hero.name}</p>
                    <p className="text-xs text-muted-foreground">Admin Panel</p>
                </div>
            </div>
            <div className="flex flex-1 flex-col justify-between overflow-y-auto">
                <nav className="flex-1 space-y-2 p-4">
                    <p className="px-2 text-xs font-semibold uppercase text-muted-foreground">Main</p>
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
                     <p className="px-2 text-xs font-semibold uppercase text-muted-foreground">Tools</p>
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
            <div className="border-t border-border p-4">
                <Button variant="ghost" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                </Button>
                 <Button variant="ghost" className="w-full justify-start gap-2 mt-2">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>KD</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                        <p className="text-sm font-medium leading-none">Kapil Dev</p>
                        <p className="text-xs text-muted-foreground">kapil.dev@example.com</p>
                    </div>
                </Button>
            </div>
        </aside>
    );
}
