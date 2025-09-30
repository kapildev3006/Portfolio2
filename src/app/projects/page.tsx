
import Header from '@/components/header';
import Projects from '@/components/sections/projects';
import Footer from '@/components/footer';
import { getPortfolioData } from '@/lib/portfolio-data';

export default async function ProjectsPage() {
  const portfolioData = await getPortfolioData();
  return (
    <div className="flex min-h-dvh flex-col">
      <Header portfolioData={portfolioData}/>
      <main className="flex-1">
        <Projects />
      </main>
      <Footer portfolioData={portfolioData}/>
    </div>
  );
}
