
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Download, Github, Linkedin, Mail } from 'lucide-react';
import AnimatedDiv from '@/components/animated-div';
import { Button } from '@/components/ui/button';
import { useContext } from 'react';
import { Skeleton } from '../ui/skeleton';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';

function HeroSkeleton() {
  return (
    <section className="relative w-full overflow-hidden py-20 md:py-32 min-h-[80vh] flex items-center">
      <div className="container mx-auto grid grid-cols-1 items-center gap-16 px-4 md:grid-cols-2 md:px-6">
        <div className="space-y-6 text-center md:text-left">
          <Skeleton className="h-16 w-3/4 mx-auto md:mx-0" />
          <Skeleton className="h-10 w-1/2 mx-auto md:mx-0" />
          <Skeleton className="h-5 w-full mx-auto md:mx-0" />
          <Skeleton className="h-5 w-5/6 mx-auto md:mx-0" />
          <div className="flex justify-center md:justify-start gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
        <div className="relative flex justify-center items-center">
          <Skeleton className="w-80 h-80 rounded-full" />
        </div>
      </div>
    </section>
  )
}


export default function Hero() {
  const { portfolioData: data, loading } = useContext(PortfolioDataContext);

  if (loading || !data) {
    return <HeroSkeleton />;
  }

  const { hero, socials } = data;

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden py-20 md:py-32 min-h-[80vh] flex items-center"
    >
      <div className="container mx-auto grid grid-cols-1 items-center gap-16 px-4 md:grid-cols-2 md:px-6">
        <div className="space-y-6 text-center md:text-left">
          <AnimatedDiv>
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Hi, I'm <span className="text-gradient">{hero.name}</span>
            </h1>
          </AnimatedDiv>
          <AnimatedDiv>
            <h2 className="font-headline text-2xl font-medium tracking-tight text-muted-foreground md:text-4xl">
              {hero.title}
            </h2>
          </AnimatedDiv>
          <AnimatedDiv>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:mx-0 md:text-xl">
              {hero.subtitle}
            </p>
          </AnimatedDiv>
          <AnimatedDiv className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-start">
              <Button asChild size="lg" className="w-full md:w-auto">
                <Link href="/projects">View My Work</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
                <Link href={hero.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download CV
                </Link>
              </Button>
          </AnimatedDiv>
          <AnimatedDiv className="flex justify-center md:justify-start gap-4 mt-6">
            <Button asChild variant="outline" size="icon">
              <Link href={socials.github} aria-label="Github">
                <Github />
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon">
              <Link href={socials.linkedin} aria-label="LinkedIn">
                <Linkedin />
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon">
              <Link href={`mailto:${data.contact.email}`} aria-label="Email">
                <Mail />
              </Link>
            </Button>
          </AnimatedDiv>
        </div>
        <AnimatedDiv className="relative flex justify-center items-center">
          <div className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000 right-10 bottom-10"></div>
          <div className="relative w-80 h-80 overflow-hidden rounded-full border-4 border-primary/20 bg-secondary/50 p-2 shadow-2xl backdrop-blur-sm">
             <div className="relative aspect-square w-full overflow-hidden rounded-full">
                <Image
                  src={hero.imageUrl}
                  alt="Hero image"
                  fill
                  className="object-cover"
                  data-ai-hint={hero.imageHint}
                  priority
                />
             </div>
          </div>
        </AnimatedDiv>
      </div>
    </section>
  );
}
