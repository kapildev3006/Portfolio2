'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CalendarDays, Edit, Trash2, ChevronDown, ChevronUp, Code, ExternalLink, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import type { Project as ProjectType } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
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
import { deleteProject, updateProjectData } from '@/lib/firestore-actions';
import { useToast } from '@/hooks/use-toast';

type AdminProjectCardProps = {
  project: ProjectType;
  index?: number;
  isFirst?: boolean;
  isLast?: boolean;
  isMoving?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
};

export default function AdminProjectCard({
  project,
  index,
  isFirst,
  isLast,
  isMoving,
  onMoveUp,
  onMoveDown,
}: AdminProjectCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  const MAX_LENGTH = 100;
  const isLong = project.description.length > MAX_LENGTH;
  const displayedText = expanded || !isLong
    ? project.description
    : project.description.slice(0, MAX_LENGTH) + '...';

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

  const toggleVisibility = async () => {
    const newVisibility = project.isVisible !== false ? false : true;
    const result = await updateProjectData(project.id, { 
        ...project, 
        isVisible: newVisibility,
        techstack: project.tags.join(', ') // Ensure techstack is passed as string for validation
    } as any);
    
    if (!result.success) {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
    } else {
        toast({ 
            title: `Project ${newVisibility ? 'Visible' : 'Hidden'}`, 
            description: `This project is now ${newVisibility ? 'visible on' : 'hidden from'} the public site.` 
        });
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 h-full">
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden flex-shrink-0">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Status badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className={`text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide
            ${project.status === 'completed' ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30' :
              project.status === 'in-progress' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30' :
              project.status === 'review' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30' :
              'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30'}`}>
            {(project.status || 'planning').replace('-', ' ')}
          </span>
          <button 
            onClick={toggleVisibility}
            className={`flex h-6 items-center gap-1 px-2 rounded-full text-[10px] font-semibold border transition-all
                ${project.isVisible !== false 
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 hover:bg-green-500/30' 
                    : 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/30'}`}
            title={project.isVisible !== false ? "Hide from Public" : "Show to Public"}
          >
            {project.isVisible !== false ? <Eye size={12} /> : <EyeOff size={12} />}
            {project.isVisible !== false ? 'Visible' : 'Private'}
          </button>
        </div>

        {/* Admin action buttons - top left overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1 z-10">
          {onMoveUp && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              disabled={isFirst || isMoving}
              title="Move project up"
              className="h-7 w-7 flex items-center justify-center rounded-md bg-background/90 border border-border text-foreground hover:text-primary hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          )}

          {onMoveDown && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              disabled={isLast || isMoving}
              title="Move project down"
              className="h-7 w-7 flex items-center justify-center rounded-md bg-background/90 border border-border text-foreground hover:text-primary hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          )}

          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <button 
                type="button"
                className="h-7 w-7 flex items-center justify-center rounded-md bg-background/90 border border-border text-foreground hover:text-primary hover:border-primary transition-all shadow-sm"
                title="Edit Project"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
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
              <button 
                type="button"
                className="h-7 w-7 flex items-center justify-center rounded-md bg-background/90 border border-border text-destructive hover:border-destructive transition-all shadow-sm"
                title="Delete Project"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the project
                  &quot;{project.title}&quot;.
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

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1 flex items-center gap-1.5">
          {typeof index === 'number' && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
              #{index + 1}
            </span>
          )}
          <span className="truncate">{project.title}</span>
        </h3>

        {/* Date */}
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <CalendarDays className="mr-1 h-3 w-3" />
          <span>{formattedDate}</span>
        </div>

        {/* Description with Read More */}
        <div className="mb-3">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {displayedText}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 flex items-center gap-0.5 text-xs text-primary hover:underline font-medium"
            >
              {expanded ? (
                <><ChevronUp size={13} /> Read less</>
              ) : (
                <><ChevronDown size={13} /> Read more</>
              )}
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        {/* Action buttons — Source left, Live Demo right */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
          <div>
            {project.sourceUrl ? (
              <Link
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-md border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all"
              >
                <Code size={13} />
                Source
              </Link>
            ) : <span />}
          </div>
          <div>
            {project.liveUrl ? (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              >
                <ExternalLink size={13} />
                Live Demo
              </Link>
            ) : <span />}
          </div>
        </div>
      </div>
    </div>
  );
}
