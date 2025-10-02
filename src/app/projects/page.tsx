
'use client'
import Header from '@/components/header';
import Projects from '@/components/sections/projects';
import Footer from '@/components/footer';
import { PortfolioDataProvider } from '@/context/PortfolioDataProvider';

export default function ProjectsPage() {
  return (
    <PortfolioDataProvider>
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">
          <Projects />
        </main>
        <Footer />
      </div>
    </PortfolioDataProvider>
  );
}
