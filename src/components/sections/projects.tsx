'use client';

import { useContext } from 'react';
import AnimatedDiv from '@/components/animated-div';
import ProjectCard from '@/components/project-card';
import { Skeleton } from '../ui/skeleton';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';

function ProjectsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-5 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Projects() {
  const { portfolioData, loading } = useContext(PortfolioDataContext);
  const projects = portfolioData?.projects || [];

  return (
    <section id="projects" className="w-full py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-16">
        <AnimatedDiv className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter text-primary sm:text-4xl md:text-5xl">
            My Projects
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            Here are some of the projects I&apos;ve worked on.
          </p>
        </AnimatedDiv>

        {loading ? (
            <ProjectsSkeleton />
        ) : projects.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No projects yet. Add some from the admin panel!</p>
        ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                  <AnimatedDiv
                    key={project.id}
                    className="h-full"
                    transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
                  >
                    <ProjectCard project={project} />
                  </AnimatedDiv>
              ))}
            </div>
        )}
      </div>
    </section>
  );
}
