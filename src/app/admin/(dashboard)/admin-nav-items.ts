
import {
  Award,
  BarChart2,
  Bell,
  Briefcase,
  Cog,
  Contact,
  LayoutGrid,
  MessageSquare,
  UserCircle,
} from 'lucide-react';

export const sidebarNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/profile', label: 'Profile', icon: UserCircle },
  { href: '/admin/about', label: 'About', icon: UserCircle },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/stats', label: 'Stats', icon: BarChart2 },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/chat', label: 'Chat', icon: MessageSquare },
  { href: '/admin/contacts', label: 'Contacts', icon: Contact },
  { href: '/admin/settings', label: 'Settings', icon: Cog },
];
