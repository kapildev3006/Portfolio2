
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, UserPlus, MessageSquare, AlertTriangle, Settings, WifiOff } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import useContactSubmissions from '@/hooks/use-contact-submissions';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { updateContactSubmissionStatus } from '@/lib/firestore-actions';
import { useToast } from '@/hooks/use-toast';

const NotificationSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 rounded-lg border p-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
        ))}
    </div>
);

export default function AdminNotificationsPage() {
  const { submissions, loading, error } = useContactSubmissions();
  const { toast } = useToast();

  const handleMarkAllAsRead = async () => {
    const unreadSubmissions = submissions.filter(s => !s.isRead);
    if (unreadSubmissions.length === 0) {
      toast({ title: "No unread notifications."});
      return;
    }

    const promises = unreadSubmissions.map(s => updateContactSubmissionStatus(s.id, true));
    
    Promise.all(promises)
      .then(() => {
        toast({
          title: "Success",
          description: "All notifications marked as read.",
        });
      })
      .catch((error) => {
        // The error is already being emitted by `updateContactSubmissionStatus`
        // We just need to show a toast to the user.
        console.error("One or more updates failed:", error);
        toast({
          title: "Error",
          description: "Could not mark all notifications as read. Please check permissions.",
          variant: "destructive",
        });
      });
  };

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'Messages':
        return <MessageSquare className="h-6 w-6 text-blue-500" />;
      case 'Users':
        return <UserPlus className="h-6 w-6 text-green-500" />;
      case 'System':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };


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
                <Button variant="ghost" onClick={handleMarkAllAsRead}>Mark all as read</Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/settings">General Settings</Link>
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
             <NotificationSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <WifiOff className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Could not fetch notifications</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Please check your connection and try again.
                </p>
            </div>
          ) : submissions.length === 0 ? (
             <div className="text-center text-muted-foreground py-12">
                <Bell className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">No notifications yet</h3>
                <p className="mt-1 text-sm">New messages from your contact form will appear here.</p>
            </div>
          ) : (
            submissions.map((submission) => (
             <Link key={submission.id} href="/admin/contacts" className="block rounded-lg transition-colors hover:bg-secondary/80">
                <div
                  className={`flex items-start gap-4 border p-4 rounded-lg ${
                    !submission.isRead ? 'bg-secondary/50' : 'bg-transparent'
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {getIconForCategory("Messages")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{submission.subject}</p>
                      <div className="flex items-center gap-4">
                         <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(submission.createdAt.toDate(), { addSuffix: true })}
                         </p>
                         {!submission.isRead && <div className="h-2 w-2 rounded-full bg-primary" title="Unread"></div>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">New message from <span className="font-medium text-foreground">{submission.name}</span>.</p>
                  </div>
                </div>
            </Link>
          )))}
        </CardContent>
      </Card>
    </div>
  );
}
