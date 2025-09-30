import { portfolioData } from '@/lib/portfolio-data';
import AnimatedDiv from '@/components/animated-div';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { SkillCategory, Experience } from '@/lib/types';

const SkillCard = ({ skill }: { skill: SkillCategory }) => (
  <Card className="bg-secondary/50 p-2">
    <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        {skill.icon}
      </div>
      <div>
        <CardTitle className="text-lg font-bold">{skill.title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <p className="text-sm text-muted-foreground">{skill.skills}</p>
    </CardContent>
  </Card>
);

const JourneyCard = ({ item }: { item: Experience }) => (
  <Card className="bg-secondary/50">
    <CardHeader className="flex flex-row items-start justify-between space-y-0 p-6 pb-2">
      <div className="flex items-center gap-4">
         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          {item.icon}
        </div>
        <div>
          <CardTitle className="text-lg font-bold">{item.role}</CardTitle>
           <p className="text-sm text-primary">{item.company}</p>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">{item.period}</div>
    </CardHeader>
    <CardContent className="p-6 pt-2">
      <p className="text-sm text-muted-foreground">{item.description}</p>
    </CardContent>
  </Card>
);


export default function About() {
  const { about } = portfolioData;

  return (
    <section id="about" className="w-full bg-background py-20 md:py-32">
       <div className="container mx-auto px-4 md:px-6">
        <AnimatedDiv className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            About Me
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            {about.subtitle}
          </p>
        </AnimatedDiv>
        
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <AnimatedDiv className="space-y-8">
            <h3 className="font-headline text-2xl font-bold text-center lg:text-left">My Skills</h3>
            <div className="space-y-6">
              {about.skills.map((skill, index) => (
                <SkillCard key={index} skill={skill} />
              ))}
            </div>
          </AnimatedDiv>
          
          <AnimatedDiv className="space-y-8">
            <h3 className="font-headline text-2xl font-bold text-center lg:text-left">My Journey</h3>
            <div className="space-y-6">
              {about.experience.map((item, index) => (
                <JourneyCard key={index} item={item} />
              ))}
            </div>
          </AnimatedDiv>
        </div>
      </div>
    </section>
  );
}
