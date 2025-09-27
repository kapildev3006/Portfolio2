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

export type PortfolioData = {
  hero: {
    name: string;
    title: string;
    subtitle: string;
  };
  about: {
    description: string[];
    imageUrl: string;
    imageHint: string;
  };
  projects: Project[];
  contact: {
    email: string;
  };
};

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};
