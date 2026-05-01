
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
    <section className="relative w-full overflow-hidden h-[calc(100vh-5rem)] flex items-center bg-background">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:px-16">
        <div className="space-y-5">
          <Skeleton className="h-14 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="flex justify-center">
          <Skeleton className="w-[280px] h-[280px] rounded-full" />
        </div>
      </div>
    </section>
  );
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
      className="relative w-full overflow-hidden h-[calc(100vh-5rem)] flex items-center bg-background"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-950/40 rounded-full blur-[150px] -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-950/30 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-6 md:grid-cols-2 md:px-16 relative z-10 py-16">
        {/* Left: Text Content */}
        <div className="space-y-6">
          <AnimatedDiv>
            <h1 className="text-4xl font-extrabold sm:text-5xl text-foreground leading-tight">
              Hi, I'm <span className="text-primary">{hero.name}</span>
            </h1>
          </AnimatedDiv>

          <AnimatedDiv>
            <h2 className="text-2xl font-bold text-foreground/80">
              {hero.title}
            </h2>
          </AnimatedDiv>

          <AnimatedDiv>
            <p className="text-muted-foreground text-base leading-relaxed max-w-md">
              {hero.subtitle || 'Passionate about Full Stack Developer with expertise in modern web technologies.'}
            </p>
          </AnimatedDiv>

          <AnimatedDiv className="flex flex-wrap gap-3">
            <Button asChild className="h-10 px-6 bg-primary text-black hover:bg-primary/90 font-bold text-sm rounded">
              <Link href="/projects">View My Work</Link>
            </Button>
            <Button asChild variant="outline" className="h-10 px-6 text-sm rounded">
              <a
                href={hero.resumeUrl?.includes('/image/upload/')
                  ? hero.resumeUrl.replace('/image/upload/', '/image/upload/fl_attachment/')
                  : hero.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </a>
            </Button>
          </AnimatedDiv>

          <AnimatedDiv className="flex gap-3">
            <Link href={socials.github} className="w-9 h-9 flex items-center justify-center border border-border rounded bg-transparent text-muted-foreground hover:text-primary hover:border-primary transition-all">
              <Github size={16} />
            </Link>
            <Link href={socials.linkedin} className="w-9 h-9 flex items-center justify-center border border-border rounded bg-transparent text-muted-foreground hover:text-primary hover:border-primary transition-all">
              <Linkedin size={16} />
            </Link>
            <Link href={`mailto:${data.contact.email}`} className="w-9 h-9 flex items-center justify-center border border-border rounded bg-transparent text-muted-foreground hover:text-primary hover:border-primary transition-all">
              <Mail size={16} />
            </Link>
          </AnimatedDiv>
        </div>

        {/* Right: Profile Image */}
        <AnimatedDiv className="flex justify-center md:justify-end items-center">
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute -inset-3 rounded-full border border-primary/30"></div>
            {/* Inner accent ring */}
            <div className="absolute -inset-1 rounded-full border-2 border-primary/60"></div>

            <div className="relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] overflow-hidden rounded-full border-4 border-background shadow-xl">
              <Image
                src={hero.imageUrl}
                alt={hero.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </AnimatedDiv>
      </div>
    </section>
  );
}
