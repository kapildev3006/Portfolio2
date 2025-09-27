import { portfolioData } from '@/lib/data';
import AnimatedDiv from '@/components/animated-div';
import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const { hero } = portfolioData;

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100dvh-4rem)] w-full items-center justify-center bg-background py-20 md:py-32"
    >
      <div className="container mx-auto px-4 text-center md:px-6">
        <AnimatedDiv>
          <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl">
            {hero.name}
          </h1>
        </AnimatedDiv>
        <AnimatedDiv delay={0.2}>
          <h2 className="mt-4 font-headline text-2xl font-medium tracking-tight md:text-4xl">
            {hero.title}
          </h2>
        </AnimatedDiv>
        <AnimatedDiv delay={0.4}>
          <p className="mx-auto mt-6 max-w-[700px] text-muted-foreground md:text-xl">
            {hero.subtitle}
          </p>
        </AnimatedDiv>
        <AnimatedDiv delay={0.6} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="#projects">View My Work</Link>
          </Button>
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
