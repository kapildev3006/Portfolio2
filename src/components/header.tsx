'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { NavItem, PortfolioData } from '@/lib/types';
import { ThemeToggle } from './theme-toggle';

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Contact', href: '/contact' },
];

type HeaderProps = {
  portfolioData: PortfolioData;
}

export default function Header({ portfolioData }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        'bg-background/80 backdrop-blur-sm shadow-md'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-gradient">{portfolioData.hero.name}</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                item.href === pathname
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
           <Button asChild variant="ghost" size="icon">
              <Link href="/admin">
                <User />
                <span className="sr-only">Admin</span>
              </Link>
            </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col items-center gap-4 bg-background py-4">
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
