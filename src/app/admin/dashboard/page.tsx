import { ArrowUpRight, BarChart, FolderKanban, MessageSquare, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const stats = [
    { title: 'Total Projects', value: '156', change: '+12%', icon: <FolderKanban className="text-blue-400" />, color: 'bg-blue-400/10' },
    { title: 'Active Clients', value: '48', change: '+8%', icon: <Users className="text-green-400" />, color: 'bg-green-400/10' },
    { title: 'New Messages', value: '23', change: '+5', icon: <MessageSquare className="text-purple-400" />, color: 'bg-purple-400/10' },
    { title: 'Revenue', value: '$84.2K', change: '+18%', icon: <BarChart className="text-yellow-400" />, color: 'bg-yellow-400/10' },
];

const recentProjects = [
    { title: 'E-commerce Platform', company: 'TechStart Inc', progress: 75, status: 'In Progress', statusColor: 'bg-blue-500' },
    { title: 'Mobile Banking App', company: 'FinanceFlow', progress: 90, status: 'Review', statusColor: 'bg-yellow-500' },
];

const recentMessages = [
    { name: 'Sarah Johnson', time: '2 hours ago', message: 'Hi, I\'d like to discuss the e-commerce project timeline...' },
    { name: 'Michael Chen', time: '5 hours ago', message: 'The wireframes look great! Can we schedule a call?' },
    { name: 'Emily Rodriguez', time: '1 day ago', message: 'Thank you for the quick turnaround on the fixes.' },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
         <div className="flex items-center space-x-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Last updated</span>
                <span>28/09/2025</span>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-md ${stat.color}`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="flex items-center text-xs text-green-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Recent Projects</CardTitle>
                <a href="#" className="text-sm font-medium text-primary hover:underline">View All</a>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {recentProjects.map((project, index) => (
                <div key={index}>
                    <div className="mb-2 flex justify-between text-sm">
                        <div>
                            <p className="font-medium">{project.title}</p>
                            <p className="text-muted-foreground">{project.company}</p>
                        </div>
                        <div className="text-right">
                            <Badge variant="outline" className={`border-none ${project.statusColor} text-white`}>{project.status}</Badge>
                            <p className="mt-1 text-muted-foreground">15/01/2024</p>
                        </div>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <p className="mt-1 text-right text-sm text-muted-foreground">{project.progress}%</p>
                </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Recent Messages</CardTitle>
                <a href="#" className="text-sm font-medium text-primary hover:underline">View All</a>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMessages.map((msg, index) => (
                <div key={index} className="flex items-start gap-4 border-l-2 border-green-500 pl-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold">{msg.name}</p>
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                            <p className="ml-auto text-xs text-muted-foreground">{msg.time}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                    </div>
                </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
