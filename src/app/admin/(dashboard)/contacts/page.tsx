
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Eye, Mail, Search, Trash2, WifiOff } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import useContactSubmissions from '@/hooks/use-contact-submissions';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { deleteContactSubmission, updateContactSubmissionStatus } from '@/lib/firestore-actions';
import { useToast } from '@/hooks/use-toast';
import type { ContactSubmission } from '@/lib/types';


const ContactSubmissionsSkeleton = () => (
    <TableBody>
        {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                <TableCell className="text-right space-x-2">
                    <Skeleton className="h-8 w-8 inline-block" />
                    <Skeleton className="h-8 w-8 inline-block" />
                </TableCell>
            </TableRow>
        ))}
    </TableBody>
);

const ViewMessageDialog = ({ submission }: { submission: ContactSubmission }) => {
    const handleMarkAsRead = async () => {
        if (!submission.isRead) {
            await updateContactSubmissionStatus(submission.id, true);
        }
    };
    return (
        <Dialog onOpenChange={(open) => open && handleMarkAsRead()}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="View Message">
                  <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{submission.subject}</DialogTitle>
                    <DialogDescription>
                        From: {submission.name} &lt;{submission.email}&gt;
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 text-sm text-muted-foreground">
                    <p>{submission.message}</p>
                </div>
                <div className="text-xs text-muted-foreground mt-4">
                    Received on {format(submission.createdAt.toDate(), 'PPP p')}
                </div>
            </DialogContent>
        </Dialog>
    )
};


export default function AdminContactsPage() {
  const { submissions, loading, error } = useContactSubmissions();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const result = await deleteContactSubmission(id);
    toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
    });
  }

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Contacts</h1>
        <p className="text-muted-foreground">Manage your contact form submissions.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Submissions</CardTitle>
            <div className="relative w-1/3">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search submissions..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {loading ? <ContactSubmissionsSkeleton /> : (
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <WifiOff className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2">Could not fetch submissions.</p>
                  </TableCell>
                </TableRow>
              ) : filteredSubmissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Mail className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2">No submissions found.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id} className={!submission.isRead ? 'font-bold' : ''}>
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>{submission.subject}</TableCell>
                    <TableCell>{format(submission.createdAt.toDate(), 'PP')}</TableCell>
                    <TableCell>
                      <Badge variant={!submission.isRead ? 'default' : 'outline'}>
                          {!submission.isRead ? 'New' : 'Read'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ViewMessageDialog submission={submission} />

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Delete Message">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete this message. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(submission.id)} className="bg-destructive hover:bg-destructive/90">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            )}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
