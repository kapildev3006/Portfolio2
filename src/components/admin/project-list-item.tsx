
'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Edit, Trash2, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
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
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { ProjectStatus } from '@/lib/types';

type AdminProjectListItemProps = {
  project: ProjectType;
  index?: number;
  isFirst?: boolean;
  isLast?: boolean;
  isMoving?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
};

const statusBadgeVariants = cva(
  "capitalize border-transparent",
  {
    variants: {
      status: {
        planning: "bg-yellow-500/20 text-yellow-500",
        'in-progress': "bg-blue-500/20 text-blue-500",
        completed: "bg-green-500/20 text-green-500",
        review: "bg-purple-500/20 text-purple-500",
      },
    },
    defaultVariants: {
      status: "planning",
    },
  }
)

export default function AdminProjectList({
  project,
  index,
  isFirst,
  isLast,
  isMoving,
  onMoveUp,
  onMoveDown,
}: AdminProjectListItemProps) {
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
    <tr className="border-b transition-colors hover:bg-muted/50">
        <td className="p-4">
            <div className="h-10 w-10 relative rounded-lg overflow-hidden">
                <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
            </div>
        </td>
        <td className="p-4 font-semibold">
          <div className="flex items-center gap-1.5">
            {typeof index === 'number' && (
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                #{index + 1}
              </span>
            )}
            <span>{project.title}</span>
          </div>
        </td>
        <td className="p-4">
             <div className="flex items-center gap-2">
                <Badge className={cn(statusBadgeVariants({ status: (project.status || 'planning') as ProjectStatus }))}>
                    {(project.status || 'planning').replace('-', ' ')}
                </Badge>
                {project.isVisible === false && (
                    <Badge variant="destructive" className="flex items-center gap-1 bg-red-500/20 text-red-500 border-red-500/30">
                        <EyeOff className="h-3 w-3" />
                        Private
                    </Badge>
                )}
             </div>
        </td>
        <td className="p-4 text-muted-foreground">{formattedDate}</td>
        <td className="p-4">
            <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-secondary/50 text-muted-foreground">
                    {tag}
                    </Badge>
                ))}
                {project.tags.length > 2 && <Badge variant="secondary">+{project.tags.length - 2}</Badge>}
            </div>
        </td>
        <td className="p-4 text-right">
            <div className="flex justify-end items-center gap-1">
                {onMoveUp && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                    disabled={isFirst || isMoving}
                    onClick={onMoveUp}
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                )}
                {onMoveDown && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                    disabled={isLast || isMoving}
                    onClick={onMoveDown}
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                )}
                 <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit project">
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80" title="Delete project">
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
        </td>
    </tr>
  );
}
