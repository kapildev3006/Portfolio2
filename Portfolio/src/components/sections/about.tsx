
import AnimatedDiv from '@/components/animated-div';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { SkillCategory, Experience } from '@/lib/types';
import { Code, Database, Equal, Rocket, ScreenShare, Wand2 } from 'lucide-react';

const aboutData = {
  subtitle: 'Passionate Full Stack Developer with expertise in modern web technologies.',
  skills: [
    {
      title: 'Frontend Development',
      skills: 'React, Next.js, TypeScript, Tailwind CSS',
      icon: <Code />,
    },
    {
      title: 'Backend Development',
      skills: 'Node.js, Express, Python, Flask',
      icon: <Equal />,
    },
    {
      title: 'Database Management',
      skills: 'MySQL, MongoDB, Firebase, PostgreSQL',
      icon: <Database />,
    },
  ],
  experience: [
    {
      role: 'Full Stack Developer',
      company: 'Freelance',
      period: '2023 - Present',
      description: 'Building scalable web applications and providing technical solutions for clients across various industries.',
      icon: <Rocket />,
    },
    {
      role: 'Web Developer',
      company: 'Personal Projects',
      period: '2022 - 2023',
      description: 'Developed multiple full-stack applications including voting systems, healthcare platforms, and e-commerce solutions.',
      icon: <ScreenShare />,
    },
    {
      role: 'Student Developer',
      company: 'University Projects',
      period: '2021 - 2022',
      description: 'Collaborated on various academic projects, gaining foundational knowledge in software development and computer science principles.',
      icon: <Wand2 />,
    }
  ]
};


const SkillCard = ({ skill }: { skill: SkillCategory }) => (
  <Card className="bg-secondary/50">
    <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        {skill.icon}
      </div>
      <CardTitle className="text-lg font-bold">{skill.title}</CardTitle>
    </CardHeader>
    <CardContent className="p-6 pt-0">
      <p className="text-sm text-muted-foreground">{skill.skills}</p>
    </CardContent>
  </Card>
);

const JourneyCard = ({ item }: { item: Experience }) => (
  <Card className="bg-secondary/50">
    <CardHeader className="space-y-0 p-6 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            {item.icon}
          </div>
          <div>
            <CardTitle className="text-lg font-bold">{item.role}</CardTitle>
            <p className="text-sm text-primary">{item.company}</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">{item.period}</div>
      </div>
    </CardHeader>
    <CardContent className="p-6 pt-2">
      <p className="text-sm text-muted-foreground">{item.description}</p>
    </CardContent>
  </Card>
);


export default function About() {
  const { skills, experience, subtitle } = aboutData;

  return (
    <section id="about" className="w-full bg-background py-20 md:py-32">
       <div className="container mx-auto px-4 md:px-6">
        <AnimatedDiv className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            About Me
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            {subtitle}
          </p>
        </AnimatedDiv>
        
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          <AnimatedDiv className="space-y-8">
            <h3 className="font-headline text-2xl font-bold text-center md:text-left">My Skills</h3>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <SkillCard key={index} skill={skill} />
              ))}
            </div>
          </AnimatedDiv>
          
          <AnimatedDiv className="space-y-8">
            <h3 className="font-headline text-2xl font-bold text-center md:text-left">My Journey</h3>
            <div className="space-y-6">
              {experience.map((item, index) => (
                <JourneyCard key={index} item={item} />
              ))}
            </div>
          </AnimatedDiv>
        </div>
      </div>
    </section>
  );
}
