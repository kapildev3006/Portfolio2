

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Trash2, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const contactSubmissions = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Inquiry about Web Development Services',
    date: '2024-07-29',
    status: 'New',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    subject: 'Collaboration Proposal',
    date: '2024-07-28',
    status: 'Read',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    subject: 'Question about Project Zenith',
    date: '2024-07-27',
    status: 'Replied',
  },
    {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    subject: 'Bug Report on E-commerce Platform',
    date: '2024-07-26',
    status: 'Read',
  },
    {
    id: '5',
    name: 'Chris Lee',
    email: 'chris.lee@example.com',
    subject: 'Hiring Inquiry',
    date: '2024-07-25',
    status: 'New',
  },
];

export default function AdminContactsPage() {
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
                <Input placeholder="Search submissions..." className="pl-10" />
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
            <TableBody>
              {contactSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.subject}</TableCell>
                  <TableCell>{submission.date}</TableCell>
                  <TableCell>
                    <Badge variant={submission.status === 'New' ? 'default' : submission.status === 'Replied' ? 'secondary' : 'outline'}>
                        {submission.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="View Message">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Delete Message">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
