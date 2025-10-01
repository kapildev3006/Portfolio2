

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
}

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  icon: React.ReactNode;
}

export type PortfolioData = {
  hero: {
    name: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    imageHint: string;
    resumeUrl: string;
  };
  about: {
    subtitle: string;
    skills: Omit<SkillCategory, 'icon'>[];
    experience: Omit<Experience, 'icon'>[];
  };
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  contact: {
    email: string;
    phone?: string;
    location?: string;
  };
  socials: {
    linkedin: string;
    github: string;
    twitter: string;
  }
};

export type ContactFormData = {
  name:string;
  email: string;
  message: string;
};
