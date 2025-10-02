
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowUpRight,
  Briefcase,
  DollarSign,
  MessageSquare,
  Users,
  Folder,
} from 'lucide-react';
import Link from 'next/link';
import { useContext } from 'react';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';
import { Skeleton } from '@/components/ui/skeleton';
import useProjects from '@/hooks/use-projects';
import useContactSubmissions from '@/hooks/use-contact-submissions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';

function DashboardSkeleton() {
  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-8 w-8" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="bg-card">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { portfolioData, loading: portfolioLoading } = useContext(PortfolioDataContext);
  const { projects, loading: projectsLoading } = useProjects();
  const { submissions, loading: submissionsLoading } = useContactSubmissions();

  const loading = portfolioLoading || projectsLoading || submissionsLoading;
  
  const totalProjects = projects.length;
  const newMessagesCount = submissions.filter(s => !s.isRead).length;

  const recentProjects = [
    { title: 'E-commerce Platform', company: 'TechStart Inc', progress: 75, status: 'In Progress', date: '15/01/2024' },
    { title: 'Mobile Banking App', company: 'FinanceFlow', progress: 90, status: 'Review', date: '10/01/2024' },
  ];
  const recentSubmissions = submissions.slice(0, 3);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8 flex items-start justify-between">
        <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your projects.
            </p>
        </div>
        <div className="text-right">
            <p className="text-sm text-muted-foreground">Last updated</p>
            <div className="flex items-center gap-2">
                <p className="font-medium">28/09/2025</p>
                <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card shadow-md">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="bg-blue-500/20 text-blue-400 p-3 rounded-lg">
                        <Folder className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-green-400">+12%</p>
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-bold">{totalProjects}</h3>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-card shadow-md">
            <CardContent className="p-6">
                 <div className="flex justify-between items-start">
                    <div className="bg-green-500/20 text-green-400 p-3 rounded-lg">
                        <Users className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-green-400">+8%</p>
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-bold">48</h3>
                    <p className="text-sm text-muted-foreground">Active Clients</p>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-card shadow-md">
            <CardContent className="p-6">
                 <div className="flex justify-between items-start">
                    <div className="bg-purple-500/20 text-purple-400 p-3 rounded-lg">
                        <MessageSquare className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-green-400">+5</p>
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-bold">{newMessagesCount}</h3>
                    <p className="text-sm text-muted-foreground">New Messages</p>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-card shadow-md">
            <CardContent className="p-6">
                 <div className="flex justify-between items-start">
                    <div className="bg-yellow-500/20 text-yellow-400 p-3 rounded-lg">
                        <DollarSign className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-green-400">+18%</p>
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-bold">$84.2K</h3>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
        <Card className="bg-card shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Projects</CardTitle>
            <Button asChild variant="link" className="text-green-400">
              <Link href="/admin/projects">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {recentProjects.map((project, index) => (
                <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <p className="font-semibold">{project.title}</p>
                            <p className="text-sm text-muted-foreground">{project.company}</p>
                        </div>
                        <div className="text-right">
                           <Badge variant={project.status === 'In Progress' ? 'secondary' : 'destructive'} className={project.status === 'In Progress' ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}>
                               {project.status}
                           </Badge>
                           <p className="text-sm text-muted-foreground mt-1">{project.date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="h-2 [&>div]:bg-gradient-to-r from-green-400 to-yellow-400" />
                        <span className="text-sm font-medium text-muted-foreground">{project.progress}%</span>
                    </div>
                </div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-card shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Messages</CardTitle>
             <Button asChild variant="link" className="text-green-400">
              <Link href="/admin/contacts">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSubmissions.map((submission) => (
              <div key={submission.id} className="flex items-start gap-4 p-3 rounded-lg bg-secondary/30 border-l-2 border-green-400">
                <Avatar className="h-10 w-10 border-2 border-border">
                   <AvatarFallback>{submission.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1 flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium leading-none flex items-center gap-2">
                        {submission.name}
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(submission.createdAt.toDate(), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {submission.subject}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    