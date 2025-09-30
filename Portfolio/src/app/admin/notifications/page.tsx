
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, UserPlus, MessageSquare, AlertTriangle, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import Link from 'next/link';

const notifications = [
  {
    id: 1,
    icon: <UserPlus className="h-6 w-6 text-green-500" />,
    title: 'New user registered',
    description: 'A new user, John Doe, has just signed up.',
    time: '10 minutes ago',
    read: false,
    category: 'Users',
    href: '#',
  },
  {
    id: 2,
    icon: <MessageSquare className="h-6 w-6 text-blue-500" />,
    title: 'New message received',
    description: 'You have a new message from Jane Smith in the "Collaboration" thread.',
    time: '1 hour ago',
    read: false,
    category: 'Messages',
    href: '/admin/chat',
  },
  {
    id: 3,
    icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
    title: 'System alert: High CPU usage',
    description: 'Server CPU usage has exceeded 90%. Please investigate.',
    time: '3 hours ago',
    read: true,
    category: 'System',
    href: '#',
  },
  {
    id: 4,
    icon: <Settings className="h-6 w-6 text-gray-500" />,
    title: 'Profile updated successfully',
    description: 'Your profile information has been saved.',
    time: '1 day ago',
    read: true,
    category: 'Account',
    href: '#',
  },
  {
    id: 5,
    icon: <UserPlus className="h-6 w-6 text-green-500" />,
    title: 'New user registered',
    description: 'A new user, Alice, has just signed up.',
    time: '2 days ago',
    read: true,
    category: 'Users',
    href: '#',
  },
];

export default function AdminNotificationsPage() {
  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">
          Here is a list of your recent notifications.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell />
              Recent Alerts
            </CardTitle>
            <div className="flex items-center gap-2">
                <Button variant="ghost">Mark all as read</Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/notifications/settings">Notification Settings</Link>
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notification) => (
             <Link key={notification.id} href={notification.href} className="block rounded-lg transition-colors hover:bg-secondary/80">
                <div
                  className={`flex items-start gap-4 border p-4 rounded-lg ${
                    !notification.read ? 'bg-secondary/50' : 'bg-transparent'
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {notification.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{notification.title}</p>
                      <div className="flex items-center gap-4">
                         <Badge variant="outline">{notification.category}</Badge>
                         <p className="text-xs text-muted-foreground">{notification.time}</p>
                         {!notification.read && <div className="h-2 w-2 rounded-full bg-primary" title="Unread"></div>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
