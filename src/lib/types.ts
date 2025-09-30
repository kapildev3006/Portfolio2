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

export type PortfolioData = {
  hero: {
    name: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    imageHint: string;
  };
  about: {
    description: string;
    imageUrl: string;
    imageHint: string;
    skills: string[];
  };
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  contact: {
    email: string;
  };
};

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};
