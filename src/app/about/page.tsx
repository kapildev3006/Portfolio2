
'use client'
import Header from '@/components/header';
import About from '@/components/sections/about';
import Footer from '@/components/footer';
import { PortfolioDataProvider } from '@/context/PortfolioDataProvider';

export default function AboutPage() {
  return (
    <PortfolioDataProvider>
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">
          <About />
        </main>
        <Footer />
      </div>
    </PortfolioDataProvider>
  );
}
