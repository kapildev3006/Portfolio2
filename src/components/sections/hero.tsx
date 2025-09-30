'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Download, Rocket } from 'lucide-react';
import { portfolioData } from '@/lib/data';
import AnimatedDiv from '@/components/animated-div';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Hero() {
  const { hero } = portfolioData;

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden py-20 md:py-32"
    >
      <div className="container mx-auto grid grid-cols-1 items-center gap-16 px-4 md:grid-cols-2 md:px-6">
        <div className="space-y-6 text-center md:text-left">
          <AnimatedDiv>
             <Badge variant="secondary" className="gap-2 border-primary/30 bg-primary/10 text-primary">
              <Rocket className="h-4 w-4"/>
              Discover the Future of Digital Art
            </Badge>
          </AnimatedDiv>
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
              <Button asChild size="lg" className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground md:w-auto">
                <Link href="#projects">View My Work</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
                <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download CV
                </Link>
              </Button>
          </AnimatedDiv>
        </div>
        <AnimatedDiv>
          <div className="relative mx-auto aspect-square max-w-sm overflow-hidden rounded-2xl border-2 border-primary/20 bg-secondary/50 p-4 shadow-2xl backdrop-blur-sm md:max-w-none">
             <div className="relative aspect-square w-full overflow-hidden rounded-lg">
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
