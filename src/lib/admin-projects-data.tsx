
import { ShoppingCart } from 'lucide-react';
import type { ReactNode } from 'react';

export type AdminProject = {
  id: string;
  title: string;
  description: string;
  date: string;
  status: string;
  tags: string[];
  icon: ReactNode;
  imageBgColor: string;
};

const ForkIcon = () => (
    <svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 4v29" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 11c0-4.418 3.582-8 8-8s8 3.582 8 8v1h-8" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 21c0-4.418 3.582-8 8-8s8 3.582 8 8v1h-8" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path fill="white" d="M14 44c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/>
    </svg>
);


export const projectsData: AdminProject[] = [
  {
    id: '1',
    title: 'NoirCart',
    description: 'NoirCart is a premium e-commerce platform built by CyberLim, designed to provide a seamless shopping...',
    date: '08/09/2025',
    status: 'Planning',
    tags: ['ecommerce', 'noircart', 'cyberlim', 'nextjs', 'mongodb', 'fullstack', 'dark-ui'],
    icon: (
        <div className="text-center">
            <ShoppingCart size={64} strokeWidth={1} />
            <p className="text-4xl font-bold mt-4 tracking-widest">NOIRCART</p>
        </div>
    ),
    imageBgColor: 'bg-black',
  },
  {
    id: '2',
    title: 'FoodShare',
    description: 'FoodShare is a web application designed to tackle food waste by connecting individuals, restaurants, an...',
    date: '08/09/2025',
    status: 'Planning',
    tags: ['Food Waste Reduction', 'Sustainability', 'Web App', 'Next.js', 'Community', 'Social Impact', 'CyberLim Projects'],
    icon: (
        <div className="text-center">
            <ForkIcon />
             <p className="text-4xl font-bold mt-4 tracking-widest">FOODSHARE</p>
        </div>
    ),
    imageBgColor: 'bg-gradient-to-b from-lime-300 to-green-500',
  },
];
