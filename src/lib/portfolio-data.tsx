import type { PortfolioData } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Code, Database, Equal, Rocket, ScreenShare, Wand2 } from 'lucide-react';

const getImage = (id: string) => {
    const image = PlaceHolderImages.find(img => img.id === id);
    if (image) {
        return { imageUrl: image.imageUrl, imageHint: image.imageHint };
    }
    return { imageUrl: 'https://placehold.co/600x400', imageHint: 'placeholder image' };
}

export const portfolioData: PortfolioData = {
  hero: {
    name: 'Kapil Dev',
    title: 'Full Stack Developer',
    subtitle: 'Passionate Full Stack Developer with expertise in modern web technologies.',
    ...getImage('hero-image'),
  },
  about: {
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
  },
  projects: [
    {
      id: '1',
      title: 'Project Zenith',
      description: 'A comprehensive web application for project management, designed to streamline team collaboration and workflow efficiency.',
      tags: ['React', 'Next.js', 'Tailwind CSS', 'Firebase'],
      ...getImage('project-1'),
      liveUrl: '#',
      sourceUrl: '#',
    },
    {
      id: '2',
      title: 'E-commerce Platform',
      description: 'A scalable and feature-rich online store built with a modern tech stack, focusing on performance and user experience.',
      tags: ['TypeScript', 'Node.js', 'GraphQL', 'Stripe'],
      ...getImage('project-2'),
      liveUrl: '#',
    },
    {
      id: '3',
      title: 'Portfolio Website',
      description: 'A personal portfolio to showcase my work and skills, featuring a clean design and smooth animations.',
      tags: ['Framer Motion', 'GSAP', 'Next.js', 'Vercel'],
      ...getImage('project-3'),
      liveUrl: '#',
      sourceUrl: '#',
    },
    {
      id: '4',
      title: 'Data Visualization Dashboard',
      description: 'An interactive dashboard for visualizing complex datasets, helping users to gain insights through intuitive charts and graphs.',
      tags: ['D3.js', 'React', 'Python', 'Flask'],
      ...getImage('project-4'),
      sourceUrl: '#',
    },
  ],
  services: [
    { name: 'Web Development' },
    { name: 'Mobile Apps' },
    { name: 'API Development' },
  ],
  testimonials: [],
  contact: {
    email: 'kapildev@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
  },
};
