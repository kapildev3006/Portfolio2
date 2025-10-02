
'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { PortfolioData } from '@/lib/types';
import { getPortfolioData } from '@/lib/portfolio-data';
import FirebaseErrorListener from '@/components/FirebaseErrorListener';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import useAuth from '@/hooks/use-auth';
import type { Project } from '@/lib/types';

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
  const { user, loading: authLoading } = useAuth();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBaseData = useCallback(async () => {
    setLoading(true);
    try {
      // getPortfolioData now only fetches the 'main' doc, not projects
      const data = await getPortfolioData();
      setPortfolioData(data);
    } catch (error) {
      console.error("Failed to fetch portfolio data:", error);
    } finally {
      // We don't stop loading here, because we still need projects
    }
  }, []);

  useEffect(() => {
    fetchBaseData();
  }, [fetchBaseData]);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    
    // Public data doesn't need auth, but project list in admin does for now
    // This can be simplified if projects become public for the main site
    if (!user) {
        setLoading(false);
        return;
    }

    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const projectsData: Project[] = [];
        querySnapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...(doc.data() as Omit<Project, 'id'>) });
        });
        
        setPortfolioData(prevData => {
            if (!prevData) return null;
            return {
                ...prevData,
                projects: projectsData,
            }
        });
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching projects snapshot:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);


  const refreshPortfolioData = async () => {
    await fetchBaseData();
  };


  return (
    <PortfolioDataContext.Provider value={{ portfolioData, loading, refreshPortfolioData }}>
      {process.env.NODE_ENV === 'development' && <FirebaseErrorListener />}
      {children}
    </PortfolioDataContext.Provider>
  );
}
