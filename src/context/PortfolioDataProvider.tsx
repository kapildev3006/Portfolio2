
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import type { PortfolioData } from '@/lib/types';
import { getPortfolioData } from '@/lib/portfolio-data';
import { Loader2 } from 'lucide-react';

interface PortfolioContextType {
  portfolioData: PortfolioData | null;
  loading: boolean;
}

export const PortfolioDataContext = createContext<PortfolioContextType>({
  portfolioData: null,
  loading: true,
});

export function PortfolioDataProvider({ children }: { children: ReactNode }) {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPortfolioData();
        setPortfolioData(data);
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
     return (
       <div className="flex min-h-screen items-center justify-center bg-background">
         <Loader2 className="h-10 w-10 animate-spin text-primary" />
       </div>
     );
  }

  return (
    <PortfolioDataContext.Provider value={{ portfolioData, loading }}>
      {children}
    </PortfolioDataContext.Provider>
  );
}
