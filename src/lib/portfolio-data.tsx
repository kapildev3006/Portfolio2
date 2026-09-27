

import type { PortfolioData, SkillCategory, Experience, Achievement, Project } from '@/lib/types';
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
    bio: '',
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
    ],
    education: [],
    headings: {
      bio: 'My Bio',
      skills: 'My Skills',
      experience: 'Professional Journey',
      education: 'Education',
    },
    visibility: {
      bio: true,
      skills: true,
      experience: true,
      education: true,
      achievements: true,
    },
    sectionOrder: {
      bio: 1,
      skills: 2,
      experience: 3,
      education: 4,
      achievements: 5,
    },
  },
  achievements: [],
  projects: [], // Projects will be fetched from the provider
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

// This function will NO LONGER fetch projects. Projects are now streamed in PortfolioDataProvider.
export async function getPortfolioData(): Promise<Omit<PortfolioData, 'projects'>> {
    const portfolioDocRef = doc(db, 'portfolio', 'main');
    try {
        const docSnap = await getDoc(portfolioDocRef);

        if (docSnap.exists()) {
            const dbData = docSnap.data();
            
            const skillsWithIds = (dbData.about?.skills || defaultData.about.skills).map((s: Omit<SkillCategory, 'icon'>) => ({ ...s, id: s.id || uuidv4() }));
            const experienceWithIds = (dbData.about?.experience || defaultData.about.experience).map((e: Omit<Experience, 'icon'>) => ({ ...e, id: e.id || uuidv4() }));
            const achievementsWithIds = (dbData.achievements || defaultData.achievements).map((a: Omit<Achievement, 'icon'>) => ({ ...a, id: a.id || uuidv4() }));

            const heroImage = getImage('hero-image');

            return {
                hero: {
                    name: dbData.settings?.siteTitle || dbData.hero?.name || defaultData.hero.name,
                    title: dbData.hero?.title || defaultData.hero.title,
                    subtitle: dbData.hero?.subtitle || defaultData.hero.subtitle,
                    imageUrl: dbData.hero?.imageUrl || heroImage.imageUrl,
                    imageHint: dbData.hero?.imageHint || heroImage.imageHint,
                    resumeUrl: dbData.hero?.resumeUrl || defaultData.hero.resumeUrl,
                    resumeFileName: dbData.hero?.resumeFileName || '',
                    isResumeVisible: dbData.hero?.isResumeVisible,
                    isImageVisible: dbData.hero?.isImageVisible,
                },
                 about: {
                    subtitle: dbData.about?.subtitle || defaultData.about.subtitle,
                    bio: dbData.about?.bio || defaultData.about.bio,
                    skills: skillsWithIds,
                    experience: experienceWithIds,
                    education: dbData.about?.education || [],
                    headings: dbData.about?.headings || defaultData.about.headings || {},
                    visibility: dbData.about?.visibility || { skills: true, experience: true, education: true, bio: true, achievements: true },
                    sectionOrder: dbData.about?.sectionOrder || { bio: 1, skills: 2, experience: 3, education: 4, achievements: 5 },
                },
                achievements: achievementsWithIds,
                customSections: dbData.customSections || [],
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
                services: defaultData.services,
                testimonials: defaultData.testimonials,
                settings: dbData.settings,
            };
        } else {
            console.log("No such document! Returning default data.");
            return (({ projects, ...rest }) => rest)(defaultData);
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
        return (({ projects, ...rest }) => rest)(defaultData);
    }
}
