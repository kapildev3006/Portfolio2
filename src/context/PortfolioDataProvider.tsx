
'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { PortfolioData } from '@/lib/types';
import { getPortfolioData } from '@/lib/portfolio-data';
import FirebaseErrorListener from '@/components/FirebaseErrorListener';

interface PortfolioContextType {
  portfolioData: PortfolioData | null;
  loading: boolean;
  refreshPortfolioData: () => Promise<void>;
}

export const PortfolioDataContext = createContext<PortfolioContextType>({
  portfolioData: null,
  loading: true,
  refreshPortfolioData: async () => {},
});

export function PortfolioDataProvider({ children }: { children: ReactNode }) {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPortfolioData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPortfolioData();
      setPortfolioData(data);
    } catch (error) {
      console.error("Failed to fetch portfolio data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  const refreshPortfolioData = async () => {
    await fetchPortfolioData();
  };


  return (
    <PortfolioDataContext.Provider value={{ portfolioData, loading, refreshPortfolioData }}>
      {process.env.NODE_ENV === 'development' && <FirebaseErrorListener />}
      {children}
    </PortfolioDataContext.Provider>
  );
}
