
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, UserCircle, Cog } from 'lucide-react';
import Link from 'next/link';
import { useContext } from 'react';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardSkeleton() {
    return (
        <div className="flex-1 bg-background p-8 text-foreground">
            <div className="mb-8">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-4 w-1/3 mt-2" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-3/4 mb-4" />
                            <Skeleton className="h-10 w-24" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
  const { portfolioData, loading } = useContext(PortfolioDataContext);

  const heroName = portfolioData?.hero?.name || 'Admin';

  const quickLinks = [
    {
      title: 'Manage Profile',
      description: 'Update your personal info, photo, and resume.',
      href: '/admin/profile',
      icon: <UserCircle className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Manage Projects',
      description: 'Add, edit, or remove your portfolio projects.',
      href: '/admin/projects',
      icon: <Briefcase className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Site Settings',
      description: 'Customize theme, appearance, and general settings.',
      href: '/admin/settings',
      icon: <Cog className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
            {loading ? <Skeleton className="h-10 w-1/2" /> : `Welcome, ${heroName}!`}
        </h1>
        <div className="text-muted-foreground">
            {loading ? <Skeleton className="h-4 w-1/3 mt-2" /> : "Here's a quick overview of your admin panel."}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Card key={link.href} className="flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex-row items-center gap-4 space-y-0">
                {link.icon}
                <CardTitle>{link.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{link.description}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href={link.href}>
                  Go to {link.title.split(' ')[1]}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Portfolio Analytics</CardTitle>
                <p className="text-muted-foreground">View detailed statistics about your portfolio content.</p>
            </CardHeader>
            <CardContent>
                 <Button asChild>
                    <Link href="/admin/stats">View Stats</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
