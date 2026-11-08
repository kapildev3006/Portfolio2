'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Download, Github, Linkedin, Mail } from 'lucide-react';
import AnimatedDiv from '@/components/animated-div';
import { Button } from '@/components/ui/button';
import { useContext, useState, useEffect, useMemo } from 'react';
import { Skeleton } from '../ui/skeleton';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';
import { cn, downloadFile } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

function HeroSkeleton() {
  return (
    <section className="relative w-full overflow-hidden h-[calc(100vh-5rem)] flex items-center bg-transparent">
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

  const hero = data?.hero;
  const socials = data?.socials;

  const titles = useMemo(() => {
    if (hero?.titles && Array.isArray(hero.titles) && hero.titles.length > 0) {
      const validTitles = hero.titles
        .map((t) => (typeof t === 'string' ? t.trim() : ''))
        .filter(Boolean);
      if (validTitles.length > 0) return validTitles;
    }
    if (hero?.title && hero.title.trim()) {
      return [hero.title.trim()];
    }
    return ['Full Stack Developer'];
  }, [hero?.titles, hero?.title]);

  const [titleIndex, setTitleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Configurable hold duration after typing full word (in ms, min 500ms)
  const holdDurationMs = Math.max(500, (hero?.titleInterval ?? 3) * 1000);

  // Gradient text detection
  const isGradient = Boolean(
    hero?.titleColor && (hero.titleColor.includes('gradient') || hero.titleColor.includes('linear-'))
  );

  // Keep index within bounds if list shrinks
  useEffect(() => {
    if (titleIndex >= titles.length) {
      setTitleIndex(0);
      setDisplayedText('');
      setIsDeleting(false);
    }
  }, [titles.length, titleIndex]);

  // Typewriter effect: Write (type) -> Hold -> Erase (backspace) -> Next Title
  useEffect(() => {
    const currentTitle = titles[titleIndex] || '';

    // If only 1 title and it's fully typed, stay displayed
    if (titles.length <= 1 && displayedText === currentTitle) {
      return;
    }

    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // Writing phase: type character-by-character
      if (displayedText.length < currentTitle.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentTitle.slice(0, displayedText.length + 1));
        }, 80); // Typing speed
      } else {
        // Full word typed: hold for configured duration before erasing
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, holdDurationMs);
      }
    } else {
      // Erasing phase: erase character-by-character
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentTitle.slice(0, displayedText.length - 1));
        }, 40); // Erasing speed
      } else {
        // Fully erased: brief pause, switch to next title and start typing
        timer = setTimeout(() => {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % titles.length);
        }, 300); // Pause before writing next title
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, titleIndex, titles, holdDurationMs]);

  if (loading || !data || !hero || !socials) {
    return <HeroSkeleton />;
  }

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden h-[calc(100vh-5rem)] flex items-center bg-transparent"
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
            <div className={cn("h-10 sm:h-12 flex items-center overflow-hidden", hero.isImageVisible === false && "justify-center")}>
              <h2 className="flex items-center">
                <span
                  style={
                    isGradient
                      ? {
                          backgroundImage: hero?.titleColor,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          display: 'inline-block',
                        }
                      : hero?.titleColor
                      ? { color: hero.titleColor }
                      : undefined
                  }
                  className={cn(
                    "text-2xl sm:text-3xl font-bold tracking-tight py-1",
                    !hero?.titleColor && "text-foreground/85"
                  )}
                >
                  {displayedText || '\u00A0'}
                </span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  style={
                    isGradient
                      ? { backgroundImage: hero?.titleColor }
                      : hero?.titleColor
                      ? { backgroundColor: hero.titleColor }
                      : undefined
                  }
                  className={cn(
                    "inline-block w-[3px] h-6 sm:h-7 ml-1 rounded-full self-center shrink-0",
                    !hero?.titleColor && "bg-primary"
                  )}
                />
              </h2>
            </div>
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
            <div className="relative group cursor-pointer transition-all duration-500 ease-out will-change-transform hover:scale-110 active:scale-95">
              {/* Outer glow ring */}
              <div className="absolute -inset-3 rounded-full border border-primary/30 transition-all duration-500 ease-out group-hover:border-primary/70 group-hover:shadow-[0_0_40px_rgba(56,189,248,0.35)] pointer-events-none"></div>
              {/* Inner accent ring */}
              <div className="absolute -inset-1 rounded-full border-2 border-primary/60 transition-all duration-500 ease-out group-hover:border-primary pointer-events-none"></div>

              <div className="relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] overflow-hidden rounded-full border-4 border-background shadow-xl transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-primary/35">
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
