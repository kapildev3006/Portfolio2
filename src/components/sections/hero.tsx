
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Download, Github, Linkedin, Mail } from 'lucide-react';
import AnimatedDiv from '@/components/animated-div';
import { Button } from '@/components/ui/button';
import { useContext } from 'react';
import { Skeleton } from '../ui/skeleton';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';
import { cn, downloadFile } from '@/lib/utils';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const [isDownloadingResume, setIsDownloadingResume] = useState(false);
  const { toast } = useToast();

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

      <div className={cn(
        "container mx-auto grid grid-cols-1 items-center gap-8 px-6 md:px-16 relative z-10 py-16",
        hero.isImageVisible === false ? "md:grid-cols-1 max-w-4xl text-center" : "md:grid-cols-2"
      )}>
        {/* Left: Text Content */}
        <div className={cn("space-y-6", hero.isImageVisible === false && "flex flex-col items-center")}>
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

          <AnimatedDiv className={cn("flex flex-wrap gap-3", hero.isImageVisible === false && "justify-center")}>
            <Button asChild className="h-10 px-6 bg-primary text-black hover:bg-primary/90 font-bold text-sm rounded">
              <Link href="/projects">View My Work</Link>
            </Button>
            {hero.isResumeVisible !== false && (
              <Button 
                variant="outline" 
                className="h-10 px-6 text-sm rounded cursor-pointer"
                disabled={isDownloadingResume}
                onClick={async () => {
                  if (!hero.resumeUrl) return;
                  setIsDownloadingResume(true);
                  try {
                    const result = await downloadFile(
                      hero.resumeUrl, 
                      hero.resumeFileName || `${hero.name.replace(/\s+/g, '_')}_Resume.pdf`
                    );
                    if (!result.success) {
                      toast({
                        title: "Download failed",
                        description: "Could not download the resume. Opening it in a new tab instead.",
                        variant: "destructive",
                      });
                      window.open(hero.resumeUrl, '_blank');
                    }
                  } catch (error) {
                    window.open(hero.resumeUrl, '_blank');
                  } finally {
                    setIsDownloadingResume(false);
                  }
                }}
              >
                <Download className={cn("mr-2 h-4 w-4", isDownloadingResume && "animate-bounce")} />
                {isDownloadingResume ? 'Downloading...' : 'Download CV'}
              </Button>
            )}
          </AnimatedDiv>

          <AnimatedDiv className={cn("flex gap-3", hero.isImageVisible === false && "justify-center")}>
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
        {hero.isImageVisible !== false && (
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
        )}
      </div>
    </section>
  );
}
