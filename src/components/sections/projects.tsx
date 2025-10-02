
'use client';

import { useContext } from 'react';
import AnimatedDiv from '@/components/animated-div';
import ProjectCard from '@/components/project-card';
import { Skeleton } from '../ui/skeleton';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';

function ProjectsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4 rounded-lg border bg-card p-4">
                    <Skeleton className="aspect-video w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            ))}
        </div>
    );
}

export default function Projects() {
  const { portfolioData, loading } = useContext(PortfolioDataContext);
  const projects = portfolioData?.projects || [];

  return (
    <section id="projects" className="w-full bg-background py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedDiv className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter text-primary sm:text-4xl md:text-5xl">
            My Projects
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            Here are some of the projects I've worked on.
          </p>
        </AnimatedDiv>
        {loading ? (
            <ProjectsSkeleton />
        ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {projects.map((project, index) => (
                <AnimatedDiv
                key={project.id}
                transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
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
