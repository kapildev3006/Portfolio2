
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutGrid, List, Plus, Search, WifiOff, FolderOpen } from 'lucide-react';
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
import { useState, useContext, useMemo } from 'react';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';
import type { Project, ProjectStatus } from '@/lib/types';
import { projectStatusEnum } from '@/lib/types';
import AdminProjectList from '@/components/admin/project-list-item';

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

const ProjectListSkeleton = () => (
    <tbody>
        {[...Array(3)].map((_, i) => (
            <tr key={i} className="border-b">
                <td className="p-4"><Skeleton className="h-10 w-10 rounded-lg" /></td>
                <td className="p-4"><Skeleton className="h-5 w-32" /></td>
                <td className="p-4"><Skeleton className="h-5 w-16" /></td>
                <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                <td className="p-4"><div className="flex gap-2"><Skeleton className="h-5 w-16" /><Skeleton className="h-5 w-16" /></div></td>
                <td className="p-4 text-right"><div className="flex justify-end gap-2"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /></div></td>
            </tr>
        ))}
    </tbody>
);


export default function AdminProjectsPage() {
  const { portfolioData, loading } = useContext(PortfolioDataContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const error = null; 
  const projects = portfolioData?.projects || [];

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

        return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

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
            <Input 
              placeholder="Search projects..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {projectStatusEnum.options.map(status => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status.replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 rounded-md bg-secondary p-1">
            <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}>
                <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('list')}>
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

      { !loading && filteredProjects.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Projects Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Your search or filter criteria did not match any projects. Try adjusting your search.
            </p>
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <>
              <ProjectSkeleton />
              <ProjectSkeleton />
              <ProjectSkeleton />
            </>
          ) : (
            filteredProjects.map((project: Project) => (
              <AdminProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      ) : (
         <Card>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b">
                        <th className="p-4 text-left font-semibold text-muted-foreground">Image</th>
                        <th className="p-4 text-left font-semibold text-muted-foreground">Title</th>
                        <th className="p-4 text-left font-semibold text-muted-foreground">Status</th>
                        <th className="p-4 text-left font-semibold text-muted-foreground">Date</th>
                        <th className="p-4 text-left font-semibold text-muted-foreground">Tags</th>
                        <th className="p-4 text-right font-semibold text-muted-foreground">Actions</th>
                    </tr>
                </thead>
                {loading ? <ProjectListSkeleton /> : (
                    <tbody>
                        {filteredProjects.map((project) => (
                            <AdminProjectList key={project.id} project={project} />
                        ))}
                    </tbody>
                )}
            </table>
         </Card>
      )}
    </div>
  );
}
