import Image from 'next/image';
import { portfolioData } from '@/lib/data';
import AnimatedDiv from '@/components/animated-div';

export default function About() {
  const { about } = portfolioData;

  return (
    <section id="about" className="w-full bg-card py-20 md:py-32">
      <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:gap-16 md:px-6">
        <AnimatedDiv>
          <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
            <Image
              src={about.imageUrl}
              alt="About me"
              fill
              className="object-cover"
              data-ai-hint={about.imageHint}
            />
          </div>
        </AnimatedDiv>
        <AnimatedDiv className="space-y-6">
          <h2 className="font-headline text-3xl font-bold tracking-tighter text-primary sm:text-4xl md:text-5xl">
            About Me
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>{about.description}</p>
          </div>
        </AnimatedDiv>
      </div>
    </section>
  );
}
