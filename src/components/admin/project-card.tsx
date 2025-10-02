
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Edit, Trash2 } from 'lucide-react';
import type { Project as ProjectType } from '@/lib/types';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import ProjectForm from '@/components/admin/add-project-form';
import { useState } from 'react';
import { deleteProject } from '@/lib/firestore-actions';
import { useToast } from '@/hooks/use-toast';

type AdminProjectCardProps = {
  project: ProjectType;
};

export default function AdminProjectCard({ project }: AdminProjectCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const formattedDate = project.createdAt
    ? format(project.createdAt.toDate(), 'PPP')
    : 'No date';

  const handleDelete = async () => {
    const result = await deleteProject(project.id);
    toast({
      title: result.success ? 'Project Deleted' : 'Error',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });
    setDeleteDialogOpen(false);
  };

  return (
    <Card className="flex h-full transform flex-col overflow-hidden bg-card transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <CardHeader className="relative p-0">
        <div className="relative aspect-[16/10] w-full bg-secondary">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                  <DialogDescription>
                    Update the details for your project.
                  </DialogDescription>
                </DialogHeader>
                <ProjectForm project={project} onClose={() => setEditDialogOpen(false)} />
              </DialogContent>
            </Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the project
                    "{project.title}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <p className="mt-2 flex-grow text-muted-foreground">{project.description}</p>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>{formattedDate}</span>
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
