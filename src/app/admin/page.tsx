import { BarChart, Briefcase, ChevronRight, MessageSquare, Users } from 'lucide-react';
import AdminHeader from '@/components/admin/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const kpiCards = [
    {
        title: 'Total Projects',
        value: '156',
        change: '+12%',
        icon: <Briefcase className="h-6 w-6" />,
        color: 'bg-blue-500',
    },
    {
        title: 'Active Clients',
        value: '48',
        change: '+8%',
        icon: <Users className="h-6 w-6" />,
        color: 'bg-green-500',
    },
    {
        title: 'New Messages',
        value: '23',
        change: '+5',
        icon: <MessageSquare className="h-6 w-6" />,
        color: 'bg-purple-500',
    },
    {
        title: 'Revenue',
        value: '$84.2K',
        change: '+18%',
        icon: <BarChart className="h-6 w-6" />,
        color: 'bg-yellow-500',
    },
];

const recentProjects = [
    {
        name: 'E-commerce Platform',
        client: 'TechStart Inc',
        progress: 75,
        status: 'In Progress',
        statusColor: 'bg-blue-500',
        date: '15/01/2024'
    },
    {
        name: 'Mobile Banking App',
        client: 'FinanceFlow',
        progress: 90,
        status: 'Review',
        statusColor: 'bg-yellow-500',
        date: '10/01/2024'
    },
    {
        name: 'Analytics Dashboard',
        client: 'DataVizz',
        progress: 60,
        status: 'In Progress',
        statusColor: 'bg-blue-500',
        date: '05/01/2024'
    }
];

const recentMessages = [
    {
        name: 'Sarah Johnson',
        message: 'Hi, I\'d like to discuss the e-commerce project timeline...',
        time: '2 hours ago',
        avatar: '/avatars/01.png'
    },
    {
        name: 'Michael Chen',
        message: 'The wireframes look great! Can we schedule a call?',
        time: '5 hours ago',
        avatar: '/avatars/02.png'
    },
    {
        name: 'Emily Rodriguez',
        message: 'Thank you for the quick turnaround on the fixes.',
        time: '1 day ago',
        avatar: '/avatars/03.png'
    }
];


export default function AdminDashboardPage() {
    return (
        <div className="flex-1 bg-background text-foreground">
            <AdminHeader />
            <main className="p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Here's what's happening with your projects.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    {kpiCards.map((card, index) => (
                        <Card key={index} className="bg-card">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                                <span className="text-xs text-green-500 flex items-center">{card.change}</span>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color} text-white`}>
                                        {card.icon}
                                    </div>
                                    <div className="text-2xl font-bold">{card.value}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Recent Projects */}
                    <Card className="bg-card">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Projects</CardTitle>
                             <Button variant="link" asChild><Link href="#">View All</Link></Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {recentProjects.map((project, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="font-semibold">{project.name}</p>
                                            <p className="text-sm text-muted-foreground">{project.client}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="secondary" className="mb-1">{project.status}</Badge>
                                            <p className="text-xs text-muted-foreground">{project.date}</p>
                                        </div>
                                    </div>
                                    <Progress value={project.progress} className="h-2" />
                                    <p className="text-xs text-muted-foreground text-right mt-1">{project.progress}%</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Recent Messages */}
                     <Card className="bg-card">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Messages</CardTitle>
                            <Button variant="link" asChild><Link href="#">View All</Link></Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentMessages.map((msg, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50">
                                    <Avatar>
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${msg.name}`} alt={msg.name} />
                                        <AvatarFallback>{msg.name.charAt(0)}</AvatarFallback>
                                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background"></span>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">{msg.name}</p>
                                            <p className="text-xs text-muted-foreground">{msg.time}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
