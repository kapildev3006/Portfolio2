
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutGrid, List, Plus, Search, WifiOff } from 'lucide-react';
import AdminProjectCard from '@/components/admin/project-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ProjectForm from '@/components/admin/add-project-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useContext } from 'react';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';
import type { Project } from '@/lib/types';

const ProjectSkeleton = () => (
  <Card className="flex h-full transform flex-col overflow-hidden bg-card">
    <Skeleton className="aspect-[16/10] w-full" />
    <div className="flex flex-1 flex-col p-6">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full mt-2" />
      <Skeleton className="h-4 w-2/3 mt-1" />
      <div className="mt-4 flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  </Card>
);

export default function AdminProjectsPage() {
  const { portfolioData, loading } = useContext(PortfolioDataContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // For now, no error state is passed from the new provider, so we can consider it null
  const error = null; 
  const projects = portfolioData?.projects || [];

  return (
    <div className="flex-1 bg-background p-8 text-foreground">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your project portfolio</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new project.
              </DialogDescription>
            </DialogHeader>
            <ProjectForm onClose={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-8 bg-card p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search projects..." className="pl-10" />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 rounded-md bg-secondary p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground" data-active="true">
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" data-active="false">
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <WifiOff className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Could not fetch projects</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                There was an error loading your projects. Please check your connection and try again.
            </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <>
            <ProjectSkeleton />
            <ProjectSkeleton />
            <ProjectSkeleton />
          </>
        ) : (
          projects.map((project: Project) => (
            <AdminProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}
