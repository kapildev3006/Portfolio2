
'use client';

import { useState, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/types';
import { ThemeToggle } from './theme-toggle';
import { PortfolioDataContext } from '@/context/PortfolioDataProvider';

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { portfolioData } = useContext(PortfolioDataContext);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        'bg-background/80 backdrop-blur-md border-b border-border'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <span className="text-primary">{portfolioData?.hero.name || 'Kapil Dev'}</span>
        </Link>
        
        <nav className="hidden absolute left-1/2 -translate-x-1/2 items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-all hover:text-primary',
                item.href === pathname
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
           <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Link href="/admin">
                <User size={20} />
                <span className="sr-only">Admin</span>
              </Link>
            </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col items-center gap-4 bg-background py-4 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                 className={cn(
                  'text-lg font-medium transition-colors hover:text-primary',
                  item.href === pathname
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
