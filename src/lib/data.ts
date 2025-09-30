import type { PortfolioData } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => {
    const image = PlaceHolderImages.find(img => img.id === id);
    return image || { imageUrl: 'https://placehold.co/600x400', imageHint: 'placeholder image' };
}

export const portfolioData: PortfolioData = {
  hero: {
    name: 'Rohit Sengar',
    title: 'Full Stack Developer',
    subtitle: 'I build exceptional digital experiences with modern web technologies. Let\'s create something amazing together!',
    ...getImage('hero-image'),
  },
  about: {
    description: "Hello! I'm a passionate developer with a keen eye for design. I specialize in creating modern, responsive, and user-friendly web applications using the latest technologies. With a background in both creative arts and computer science, I bring a unique perspective to every project, ensuring a perfect blend of form and function. When I'm not coding, you can find me exploring new coffee shops or hiking in the mountains.",
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Node.js'],
    ...getImage('about-image'),
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
    email: 'hello@example.com',
  },
};
