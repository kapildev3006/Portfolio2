
'use client';

import AnimatedDiv from '@/components/animated-div';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { SkillCategory, Experience, EducationItem } from '@/lib/types';
import { Rocket, Wand2, GraduationCap, UserCircle, Award, ExternalLink, Download } from 'lucide-react';
import { useContext } from 'react';
import { Skeleton } from '../ui/skeleton';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';
import { downloadFileWithOriginalName } from '@/actions/upload-actions';

const SkillCard = ({ skill }: { skill: Omit<SkillCategory, 'icon'> }) => {
  const skillList = skill.skills.split(',').map(s => s.trim()).filter(s => s !== '');
  
  return (
    <Card className="bg-secondary/50 border-border group hover:border-primary/50 transition-colors duration-300">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          <Wand2 className="w-6 h-6" />
        </div>
        <CardTitle className="text-lg font-bold">{skill.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex flex-wrap gap-2">
          {skillList.map((s, i) => (
            <span 
              key={i} 
              className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
            >
              {s}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ExperienceCard = ({ item }: { item: Omit<Experience, 'icon'> }) => (
  <Card className="bg-secondary/50 border-border">
    <CardHeader className="space-y-0 p-6 pb-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">{item.role}</CardTitle>
            <p className="text-sm text-primary">{item.company}</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground font-medium">{item.period}</div>
      </div>
    </CardHeader>
    <CardContent className="p-6 pt-2">
      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
    </CardContent>
  </Card>
);

const EducationCard = ({ item }: { item: EducationItem }) => (
  <Card className="bg-secondary/50 border-border">
    <CardHeader className="space-y-0 p-6 pb-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">{item.degree}</CardTitle>
            <p className="text-sm text-primary">{item.school}</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground font-medium">{item.period}</div>
      </div>
    </CardHeader>
    {item.description && (
      <CardContent className="p-6 pt-2">
        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
      </CardContent>
    )}
  </Card>
);

const AchievementCard = ({ item }: { item: any }) => {
  const handleDownload = async () => {
    if (!item.certificateUrl) return;
    const result = await downloadFileWithOriginalName(item.certificateUrl, item.certificateName || 'certificate.pdf');
    if (result.success && result.fileBuffer) {
        const blob = new Blob([new Uint8Array(result.fileBuffer)], { type: result.contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.fileName || item.certificateName || 'certificate.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className="bg-secondary/50 border-border group hover:border-primary/50 transition-colors">
      <CardHeader className="space-y-0 p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {item.certificateUrl && item.allowView !== false && (
              <a 
                href={item.certificateUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                View
              </a>
            )}
            {item.certificateUrl && item.allowDownload && (
              <button 
                onClick={handleDownload}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Download className="w-3 h-3" />
                Download
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
      </CardContent>
    </Card>
  );
};

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

  const { about, achievements } = portfolioData;
  const headings = about.headings || {};
  const visibility = about.visibility || { bio: true, skills: true, experience: true, education: true, achievements: true };
  const sectionOrder = about.sectionOrder || { bio: 1, skills: 2, experience: 3, education: 4, achievements: 5 };

  const sections = [
    {
      id: 'bio',
      order: sectionOrder.bio,
      visible: visibility.bio,
      component: (
        <AnimatedDiv key="bio" className="space-y-6">
          <div className="flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-primary" />
            <h3 className="font-headline text-2xl font-bold">{headings.bio || 'My Bio'}</h3>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {about.bio || 'No bio available.'}
            </p>
          </div>
        </AnimatedDiv>
      )
    },
    {
      id: 'skills',
      order: sectionOrder.skills,
      visible: visibility.skills,
      component: (
        <AnimatedDiv key="skills" className="space-y-6">
          <div className="flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-primary" />
            <h3 className="font-headline text-2xl font-bold">{headings.skills || 'My Skills'}</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {about.skills.filter(s => s.isVisible !== false).sort((a, b) => (a.order || 0) - (b.order || 0)).map((skill, index) => (
              <SkillCard key={index} skill={skill} />
            ))}
          </div>
        </AnimatedDiv>
      )
    },
    {
      id: 'experience',
      order: sectionOrder.experience,
      visible: visibility.experience,
      component: (
        <AnimatedDiv key="experience" className="space-y-6">
          <div className="flex items-center gap-3">
            <Rocket className="w-8 h-8 text-primary" />
            <h3 className="font-headline text-2xl font-bold">{headings.experience || 'Professional Journey'}</h3>
          </div>
          <div className="space-y-6">
            {about.experience.filter(e => e.isVisible !== false).sort((a, b) => (a.order || 0) - (b.order || 0)).map((item, index) => (
              <ExperienceCard key={index} item={item} />
            ))}
          </div>
        </AnimatedDiv>
      )
    },
    {
      id: 'education',
      order: sectionOrder.education,
      visible: visibility.education,
      component: (
        <AnimatedDiv key="education" className="space-y-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h3 className="font-headline text-2xl font-bold">{headings.education || 'Education'}</h3>
          </div>
          <div className="space-y-6">
            {about.education?.filter(e => e.isVisible !== false).sort((a, b) => (a.order || 0) - (b.order || 0)).map((item, index) => (
              <EducationCard key={index} item={item} />
            )) || <p className="text-muted-foreground">No education details added yet.</p>}
          </div>
        </AnimatedDiv>
      )
    },
    {
      id: 'achievements',
      order: sectionOrder.achievements,
      visible: visibility.achievements && achievements && achievements.length > 0,
      fullWidth: true,
      component: (
        <AnimatedDiv key="achievements" className="space-y-6 lg:col-span-2">
           <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-primary" />
            <h3 className="font-headline text-2xl font-bold">Notable Achievements</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.filter(a => a.isVisible !== false).sort((a, b) => (a.order || 0) - (b.order || 0)).map((item, index) => (
              <AchievementCard key={index} item={item} />
            ))}
          </div>
        </AnimatedDiv>
      )
    }
  ];

  const visibleSections = sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

  return (
    <section id="about" className="w-full bg-background py-20 md:py-32">
       <div className="container mx-auto px-4 md:px-6">
        <AnimatedDiv className="mb-16 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            About Me
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary"></div>
          <p className="mx-auto mt-6 max-w-[800px] text-muted-foreground md:text-xl leading-relaxed">
            {about.subtitle}
          </p>
        </AnimatedDiv>
        
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {visibleSections.map(s => s.component)}
        </div>

        {/* Custom Sections */}
        {portfolioData.customSections && portfolioData.customSections.length > 0 && (
          <div className="mt-20 space-y-20">
            {portfolioData.customSections.filter(s => s.isVisible !== false).sort((a, b) => a.order - b.order).map((section) => (
              <AnimatedDiv key={section.id} className="space-y-8">
                <div className="text-center">
                  <h3 className="font-headline text-3xl font-bold">{section.title}</h3>
                  <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary"></div>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none mx-auto text-center">
                  <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </p>
                </div>
              </AnimatedDiv>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
