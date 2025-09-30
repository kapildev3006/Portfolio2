
import Header from '@/components/header';
import About from '@/components/sections/about';
import Footer from '@/components/footer';
import { getPortfolioData } from '@/lib/portfolio-data';

export default async function AboutPage() {
  const portfolioData = await getPortfolioData();
  return (
    <div className="flex min-h-dvh flex-col">
      <Header portfolioData={portfolioData}/>
      <main className="flex-1">
        <About />
      </main>
      <Footer portfolioData={portfolioData}/>
    </div>
  );
}
