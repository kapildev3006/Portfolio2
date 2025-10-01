
import type { PortfolioData, SkillCategory, Experience, Achievement } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { v4 as uuidv4 } from 'uuid';


const getImage = (id: string) => {
    const image = PlaceHolderImages.find(img => img.id === id);
    if (image) {
        return { imageUrl: image.imageUrl, imageHint: image.imageHint };
    }
    return { imageUrl: 'https://placehold.co/600x400', imageHint: 'placeholder image' };
}

export const staticData = {
  about: {
    subtitle: 'Passionate Full Stack Developer with expertise in modern web technologies.',
    skills: [
      {
        id: uuidv4(),
        title: 'Frontend Development',
        skills: 'React, Next.js, TypeScript, Tailwind CSS',
        icon: null,
      },
      {
        id: uuidv4(),
        title: 'Backend Development',
        skills: 'Node.js, Express, Python, Flask',
        icon: null,
      },
      {
        id: uuidv4(),
        title: 'Database Management',
        skills: 'MySQL, MongoDB, Firebase, PostgreSQL',
        icon: null,
      },
    ],
    experience: [
      {
        id: uuidv4(),
        role: 'Full Stack Developer',
        company: 'Freelance',
        period: '2023 - Present',
        description: 'Building scalable web applications and providing technical solutions for clients across various industries.',
        icon: null,
      },
      {
        id: uuidv4(),
        role: 'Web Developer',
        company: 'Personal Projects',
        period: '2022 - 2023',
        description: 'Developed multiple full-stack applications including voting systems, healthcare platforms, and e-commerce solutions.',
        icon: null,
      },
      {
        id: uuidv4(),
        role: 'Student Developer',
        company: 'University Projects',
        period: '2021 - 2022',
        description: 'Collaborated on various academic projects, gaining foundational knowledge in software development and computer science principles.',
        icon: null,
      }
    ]
  },
  achievements: [
    {
      id: uuidv4(),
      title: 'First Place Hackathon',
      description: 'Won first place in the annual university hackathon with a project focused on sustainable tech solutions.',
      date: 'May 2023',
    },
    {
      id: uuidv4(),
      title: 'Published Technical Article',
      description: 'Authored a popular article on advanced React patterns for a well-known tech blog.',
      date: 'January 2024',
    },
  ],
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
};


const defaultData: PortfolioData = {
  hero: {
    name: 'Kapil Dev',
    title: 'Full Stack Developer',
    subtitle: 'Passionate Full Stack Developer with expertise in modern web technologies.',
    ...getImage('hero-image'),
    resumeUrl: '/resume.pdf',
  },
  ...staticData,
  contact: {
    email: 'kapildev@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
  },
  socials: {
    linkedin: 'https://linkedin.com/in/your-profile',
    github: 'https://github.com/your-profile',
    twitter: 'https://twitter.com/your-profile',
  }
};

export async function getPortfolioData(): Promise<PortfolioData> {
    const portfolioDocRef = doc(db, 'portfolio', 'main');
    try {
        const docSnap = await getDoc(portfolioDocRef);

        if (docSnap.exists()) {
            const dbData = docSnap.data();
            // Ensure skills and experience have IDs
            const skillsWithIds = (dbData.about?.skills || defaultData.about.skills).map((s: Omit<SkillCategory, 'icon'>) => ({ ...s, id: s.id || uuidv4() }));
            const experienceWithIds = (dbData.about?.experience || defaultData.about.experience).map((e: Omit<Experience, 'icon'>) => ({ ...e, id: e.id || uuidv4() }));
            const achievementsWithIds = (dbData.achievements || defaultData.achievements).map((a: Omit<Achievement, 'icon'>) => ({ ...a, id: a.id || uuidv4() }));

            const heroImage = getImage('hero-image');

            return {
                hero: {
                    name: dbData.hero?.name || defaultData.hero.name,
                    title: dbData.hero?.title || defaultData.hero.title,
                    subtitle: dbData.hero?.subtitle || defaultData.hero.subtitle,
                    imageUrl: dbData.hero?.imageUrl || heroImage.imageUrl,
                    imageHint: dbData.hero?.imageHint || heroImage.imageHint,
                    resumeUrl: dbData.hero?.resumeUrl || defaultData.hero.resumeUrl,
                },
                 about: {
                    subtitle: dbData.about?.subtitle || defaultData.about.subtitle,
                    skills: skillsWithIds,
                    experience: experienceWithIds,
                },
                achievements: achievementsWithIds,
                contact: {
                    email: dbData.contact?.email || defaultData.contact.email,
                    phone: dbData.contact?.phone || defaultData.contact.phone,
                    location: dbData.contact?.location || defaultData.contact.location,
                },
                socials: {
                    linkedin: dbData.socials?.linkedin || defaultData.socials.linkedin,
                    github: dbData.socials?.github || defaultData.socials.github,
                    twitter: dbData.socials?.twitter || defaultData.socials.twitter,
                },
                projects: staticData.projects,
                services: staticData.services,
                testimonials: staticData.testimonials,
            };
        } else {
            console.log("No such document! Returning default data.");
            return defaultData;
        }
    } catch (error) {
        if ((error as any).code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: portfolioDocRef.path,
                operation: 'get',
            });
            errorEmitter.emit('permission-error', permissionError);
        } else {
            console.error("Error fetching portfolio data: ", error);
        }
        return defaultData;
    }
}
