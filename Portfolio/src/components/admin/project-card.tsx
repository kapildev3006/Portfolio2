
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Edit, Trash2 } from 'lucide-react';
import type { AdminProject } from '@/lib/admin-projects-data';

type AdminProjectCardProps = {
  project: AdminProject;
};

export default function AdminProjectCard({ project }: AdminProjectCardProps) {
  return (
    <Card className="flex h-full transform flex-col overflow-hidden bg-card transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <CardHeader className="relative p-0">
        <div className="relative aspect-[16/10] w-full bg-secondary">
           <div className={`flex items-center justify-center h-full ${project.imageBgColor}`}>
              {project.icon}
           </div>
          <Badge className="absolute right-3 top-3 border-none bg-purple-500/50 text-purple-200">
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">{project.title}</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="mt-2 flex-grow text-muted-foreground">{project.description}</p>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>{project.date}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-secondary/50 text-muted-foreground">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
