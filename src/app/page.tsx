
import Header from '@/components/header';
import Hero from '@/components/sections/hero';
import About from '@/components/sections/about';
import Projects from '@/components/sections/projects';
import Contact from '@/components/sections/contact';
import Footer from '@/components/footer';
import { getPortfolioData } from '@/lib/portfolio-data';

export default async function Home() {
  const portfolioData = await getPortfolioData();

  return (
    <div className="flex min-h-dvh flex-col">
      <Header portfolioData={portfolioData} />
      <main className="flex-1">
        <Hero hero={portfolioData.hero} socials={portfolioData.socials} />
        <About />
        <Projects />
        <Contact portfolioData={portfolioData} />
      </main>
      <Footer portfolioData={portfolioData}/>
    </div>
  );
}
