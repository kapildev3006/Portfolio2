'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, Download, Github, Linkedin } from 'lucide-react';
import { portfolioData } from '@/lib/data';
import AnimatedDiv from '@/components/animated-div';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const { hero } = portfolioData;

  return (
    <section
      id="home"
      className="relative w-full bg-background py-20 md:py-32"
    >
      <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 md:grid-cols-5 md:gap-16 md:px-6">
        <div className="order-2 space-y-6 text-center md:order-1 md:col-span-3 md:text-left">
          <AnimatedDiv>
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl">
              {hero.name}
            </h1>
          </AnimatedDiv>
          <AnimatedDiv>
            <h2 className="font-headline text-2xl font-medium tracking-tight md:text-4xl">
              {hero.title}
            </h2>
          </AnimatedDiv>
          <AnimatedDiv>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:mx-0 md:text-xl">
              {hero.subtitle}
            </p>
          </AnimatedDiv>
          <AnimatedDiv className="flex flex-col items-center justify-center gap-4 md:items-start">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="#projects">View My Work</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Link>
              </Button>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="icon">
                  <Link href="#" aria-label="LinkedIn"><Linkedin /></Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                  <Link href="#" aria-label="GitHub"><Github /></Link>
              </Button>
            </div>
          </AnimatedDiv>
        </div>
        <AnimatedDiv className="order-1 md:order-2 md:col-span-2">
          <div className="relative mx-auto w-4/5 aspect-square overflow-hidden rounded-lg shadow-lg md:w-full">
            <Image
              src={hero.imageUrl}
              alt="Hero image"
              fill
              className="object-cover"
              data-ai-hint={hero.imageHint}
              priority
            />
          </div>
        </AnimatedDiv>
      </div>
       <AnimatedDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <Link href="#about" aria-label="Scroll down">
          <ArrowDown className="h-6 w-6 animate-bounce text-muted-foreground" />
        </Link>
      </AnimatedDiv>
    </section>
  );
}
