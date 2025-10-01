
'use client';

import AnimatedDiv from '@/components/animated-div';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Achievement } from '@/lib/types';
import { Award } from 'lucide-react';
import { getPortfolioData } from '@/lib/portfolio-data';
import { useEffect, useState } from 'react';
import type { PortfolioData } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

const AchievementCard = ({ achievement }: { achievement: Omit<Achievement, 'icon'> }) => (
  <Card className="bg-secondary/50 transform transition-transform duration-300 hover:scale-105">
    <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-6 pb-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Award />
      </div>
      <div className="flex-1">
        <CardTitle className="text-lg font-bold">{achievement.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{achievement.date}</p>
      </div>
    </CardHeader>
    <CardContent className="p-6 pt-0">
      <p className="text-sm text-muted-foreground">{achievement.description}</p>
    </CardContent>
  </Card>
);

function AchievementsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
    )
}

export default function Achievements() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getPortfolioData();
      setPortfolioData(data);
    }
    fetchData();
  }, []);


  return (
    <section id="achievements" className="w-full bg-muted/30 py-20 md:py-32">
       <div className="container mx-auto px-4 md:px-6">
        <AnimatedDiv className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            My Achievements
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            A few of my proudest accomplishments and recognitions.
          </p>
        </AnimatedDiv>
        
        <AnimatedDiv>
            { portfolioData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {portfolioData.achievements.map((achievement, index) => (
                        <AchievementCard key={index} achievement={achievement} />
                    ))}
                </div>
            ) : (
                <AchievementsSkeleton />
            )}
        </AnimatedDiv>
      </div>
    </section>
  );
}
