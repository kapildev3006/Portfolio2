
import Header from '@/components/header';
import Contact from '@/components/sections/contact';
import Footer from '@/components/footer';
import { getPortfolioData } from '@/lib/portfolio-data';

export default async function ContactPage() {
  const portfolioData = await getPortfolioData();
  return (
    <div className="flex min-h-dvh flex-col">
      <Header portfolioData={portfolioData} />
      <main className="flex-1">
        <Contact portfolioData={portfolioData}/>
      </main>
      <Footer portfolioData={portfolioData} />
    </div>
  );
}
