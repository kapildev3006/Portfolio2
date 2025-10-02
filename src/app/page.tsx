
'use client';
import Header from '@/components/header';
import Hero from '@/components/sections/hero';
import About from '@/components/sections/about';
import Projects from '@/components/sections/projects';
import Contact from '@/components/sections/contact';
import Footer from '@/components/footer';
import { PortfolioDataProvider } from '@/context/PortfolioDataProvider';

export default function Home() {
  return (
    <PortfolioDataProvider>
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">
          <Hero />
          <About />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </PortfolioDataProvider>
  );
}
