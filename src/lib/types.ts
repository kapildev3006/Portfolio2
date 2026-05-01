
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  phone: z.string().optional(),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export const projectStatusEnum = z.enum(['planning', 'in-progress', 'completed', 'review']);
export type ProjectStatus = z.infer<typeof projectStatusEnum>;

export type NavItem = {
  name: string;
  href: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  imageHint: string;
  liveUrl?: string;
  sourceUrl?: string;
  createdAt?: any; // Using `any` for Firebase Timestamp flexibility
  status: ProjectStatus;
  isVisible?: boolean;
};

export type Service = {
  name: string;
};

export type Testimonial = {
  name: string;
  role: string;
  comment: string;
  imageUrl: string;
  imageHint: string;
}

export type SkillCategory = {
  id: string;
  title: string;
  skills: string;
  icon: React.ReactNode;
  order?: number;
  isVisible?: boolean;
}

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  order?: number;
  isVisible?: boolean;
}

export type Achievement = {
  id: string;
  title: string;
  description: string;
  date: string;
  icon?: React.ReactNode;
  order?: number;
  certificateUrl?: string;
  certificateName?: string;
  allowDownload?: boolean;
  allowView?: boolean;
  isVisible?: boolean;
}

export type EducationItem = {
  id: string;
  degree: string;
  school: string;
  period: string;
  description?: string;
  order?: number;
  isVisible?: boolean;
}

export type CustomSection = {
  id: string;
  title: string;
  content: string;
  order: number;
  isVisible?: boolean;
}

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any; // Using `any` for Firebase Timestamp flexibility
  isRead: boolean;
  phone?: string;
}

export type Settings = {
  siteTitle: string;
  tagline: string;
  maintenanceMode: boolean;
  theme: 'light' | 'dark';
  primaryColor: string;
  fontFamily: string;
  adminEmail: string;
  twoFactorAuth: boolean;
}

export type PortfolioData = {
  hero: {
    name: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    imageHint: string;
    resumeUrl: string;
    resumeFileName?: string;
    isResumeVisible?: boolean;
    isImageVisible?: boolean;
  };
  about: {
    subtitle: string;
    bio: string;
    skills: Omit<SkillCategory, 'icon'>[];
    experience: Omit<Experience, 'icon'>[];
    education: EducationItem[];
    headings?: {
      skills?: string;
      experience?: string;
      education?: string;
      bio?: string;
    };
    visibility?: {
      skills: boolean;
      experience: boolean;
      education: boolean;
      bio: boolean;
      achievements: boolean;
    };
    sectionOrder?: {
      bio: number;
      skills: number;
      experience: number;
      education: number;
      achievements: number;
    };
  };
  achievements: Omit<Achievement, 'icon'>[];
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  customSections?: CustomSection[];
  contact: {
    email: string;
    phone?: string;
    location?: string;
  };
  socials: {
    linkedin: string;
    github: string;
    twitter: string;
  },
  settings?: Settings;
};

export type ContactFormData = {
  name:string;
  email: string;
  message: string;
};
