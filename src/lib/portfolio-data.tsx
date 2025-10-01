
'use client';

import type { PortfolioData, SkillCategory, Experience, Achievement, Project } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { doc, getDoc, getDocs, collection, query, orderBy } from 'firebase/firestore';
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

const defaultData: PortfolioData = {
  hero: {
    name: 'Kapil Dev',
    title: 'Full Stack Developer',
    subtitle: 'Passionate Full Stack Developer with expertise in modern web technologies.',
    ...getImage('hero-image'),
    resumeUrl: '/resume.pdf',
  },
  about: {
    subtitle: 'Passionate Full Stack Developer with expertise in modern web technologies.',
    skills: [
      {
        id: uuidv4(),
        title: 'Frontend Development',
        skills: 'React, Next.js, TypeScript, Tailwind CSS',
      },
      {
        id: uuidv4(),
        title: 'Backend Development',
        skills: 'Node.js, Express, Python, Flask',
      },
    ],
    experience: [
      {
        id: uuidv4(),
        role: 'Full Stack Developer',
        company: 'Freelance',
        period: '2023 - Present',
        description: 'Building scalable web applications and providing technical solutions for clients across various industries.',
      },
    ]
  },
  achievements: [],
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
  socials: {
    linkedin: 'https://linkedin.com/in/your-profile',
    github: 'https://github.com/your-profile',
    twitter: 'https://twitter.com/your-profile',
  }
};

async function getProjects(): Promise<Project[]> {
  try {
    const projectsCollection = collection(db, 'projects');
    const q = query(projectsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return defaultData.projects;
    }
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  } catch (error) {
     if ((error as any).code === 'permission-denied') {
        const permissionError = new FirestorePermissionError({
            path: 'projects',
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
    } else {
        console.error("Error fetching projects: ", error);
    }
    return defaultData.projects;
  }
}


export async function getPortfolioData(): Promise<PortfolioData> {
    const portfolioDocRef = doc(db, 'portfolio', 'main');
    try {
        const docSnap = await getDoc(portfolioDocRef);
        const projects = await getProjects();

        if (docSnap.exists()) {
            const dbData = docSnap.data();
            
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
                projects: projects,
                services: defaultData.services,
                testimonials: defaultData.testimonials,
            };
        } else {
            console.log("No such document! Returning default data.");
            return {...defaultData, projects: await getProjects()};
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
        return {...defaultData, projects: await getProjects()};
    }
}
