
'use client';

import { staticData } from '@/lib/portfolio-data';
import AnimatedDiv from '@/components/animated-div';
import ProjectCard from '@/components/project-card';

export default function Projects() {
  const { projects } = staticData;

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
      </div>
    </section>
  );
}
