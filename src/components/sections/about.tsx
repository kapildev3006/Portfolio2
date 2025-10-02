
'use client';

import AnimatedDiv from '@/components/animated-div';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { SkillCategory, Experience } from '@/lib/types';
import { Rocket, Wand2 } from 'lucide-react';
import { useContext } from 'react';
import { Skeleton } from '../ui/skeleton';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';

const SkillCard = ({ skill }: { skill: Omit<SkillCategory, 'icon'> }) => (
  <Card className="bg-secondary/50">
    <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wand2 />
      </div>
      <CardTitle className="text-lg font-bold">{skill.title}</CardTitle>
    </CardHeader>
    <CardContent className="p-6 pt-0">
      <p className="text-sm text-muted-foreground">{skill.skills}</p>
    </CardContent>
  </Card>
);

const JourneyCard = ({ item }: { item: Omit<Experience, 'icon'> }) => (
  <Card className="bg-secondary/50">
    <CardHeader className="space-y-0 p-6 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Rocket />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">{item.role}</CardTitle>
            <p className="text-sm text-primary">{item.company}</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">{item.period}</div>
      </div>
    </CardHeader>
    <CardContent className="p-6 pt-2">
      <p className="text-sm text-muted-foreground">{item.description}</p>
    </CardContent>
  </Card>
);

function AboutPageSkeleton() {
    return (
        <div className="container mx-auto px-4 md:px-6">
            <AnimatedDiv className="mb-12 text-center">
                <Skeleton className="h-12 w-1/3 mx-auto" />
                <Skeleton className="h-6 w-2/3 mx-auto mt-4" />
            </AnimatedDiv>
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                <div className="space-y-8">
                    <Skeleton className="h-8 w-1/2 mx-auto md:mx-0" />
                    <div className="space-y-6">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
                <div className="space-y-8">
                    <Skeleton className="h-8 w-1/2 mx-auto md:mx-0" />
                    <div className="space-y-6">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default function About() {
  const { portfolioData, loading } = useContext(PortfolioDataContext);

  if (loading || !portfolioData) {
      return (
        <section id="about" className="w-full bg-background py-20 md:py-32">
            <AboutPageSkeleton />
        </section>
      )
  }

  const { about } = portfolioData;

  return (
    <section id="about" className="w-full bg-background py-20 md:py-32">
       <div className="container mx-auto px-4 md:px-6">
        <AnimatedDiv className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            About Me
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            {about.subtitle}
          </p>
        </AnimatedDiv>
        
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <AnimatedDiv className="space-y-8">
            <h3 className="font-headline text-2xl font-bold text-center lg:text-left">My Skills</h3>
            <div className="space-y-6">
              {about.skills.map((skill, index) => (
                <SkillCard key={index} skill={skill} />
              ))}
            </div>
          </AnimatedDiv>
          
          <AnimatedDiv className="space-y-8">
            <h3 className="font-headline text-2xl font-bold text-center lg:text-left">My Journey</h3>
            <div className="space-y-6">
              {about.experience.map((item, index) => (
                <JourneyCard key={index} item={item} />
              ))}
            </div>
          </AnimatedDiv>
        </div>
      </div>
    </section>
  );
}
