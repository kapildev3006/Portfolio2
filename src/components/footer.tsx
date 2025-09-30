import Link from 'next/link';
import { Code, Github, Instagram, Linkedin, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { portfolioData } from '@/lib/data';

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const services = [
    { name: 'Web Development', href: '#' },
    { name: 'Mobile Apps', href: '#' },
    { name: 'API Development', href: '#' },
    { name: 'Consulting', href: '#' },
];

const connectLinks = [
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Email', href: 'mailto:someone@example.com', icon: Send },
];


export default function Footer() {
  return (
    <footer className="w-full bg-background text-muted-foreground border-t">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Profile */}
          <div className="flex flex-col gap-4">
             <Link href="#home" className="flex items-center gap-2 font-headline text-lg font-bold text-foreground">
                <div className="rounded-full bg-primary p-2">
                    <Code className="h-6 w-6 text-primary-foreground" />
                </div>
                <span>{portfolioData.hero.name}</span>
            </Link>
            <p className="text-sm">
              {portfolioData.hero.subtitle}
            </p>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="icon">
                  <Link href="#" aria-label="LinkedIn"><Linkedin /></Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                  <Link href="#" aria-label="GitHub"><Github /></Link>
              </Button>
               <Button asChild variant="outline" size="icon">
                  <Link href="#" aria-label="Instagram"><Instagram /></Link>
              </Button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-headline text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col gap-4">
             <h3 className="font-headline text-lg font-semibold text-foreground">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link href={service.href} className="text-sm hover:text-primary transition-colors">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="flex flex-col gap-4">
            <h3 className="font-headline text-lg font-semibold text-foreground">Connect</h3>
            <ul className="space-y-2">
              {connectLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 rounded-lg bg-card p-8 text-center shadow-inner">
          <h3 className="font-headline text-2xl font-bold text-foreground">Stay Updated</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get notified about new projects and blog posts.
          </p>
          <form className="mt-6 flex max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-r-none focus:ring-0"
              aria-label="Email for newsletter"
            />
            <Button type="submit" className="rounded-l-none">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      <Separator />

      {/* Bottom Bar */}
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-6 text-sm md:px-6">
        <p>
          &copy; {new Date().getFullYear()} {portfolioData.hero.name}. Made with{' '}
          <span role="img" aria-label="love">❤️</span> in the world.
        </p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
