
'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { PortfolioData, Project } from '@/lib/types';
import { getPortfolioData } from '@/lib/portfolio-data';
import FirebaseErrorListener from '@/components/FirebaseErrorListener';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import useAuth from '@/hooks/use-auth';

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
    // This function will now only be responsible for the 'main' document.
    // The loading state will be managed by the useEffect that also handles projects.
    try {
      const data = await getPortfolioData();
      // Set the base data, but ensure projects is an empty array initially.
      // The project listener will populate this.
      setPortfolioData({ ...data, projects: [] });
    } catch (error) {
      console.error("Failed to fetch base portfolio data:", error);
      setPortfolioData(prev => prev || { projects: [] } as any); // Ensure portfolioData is not null
    }
  }, []);

  useEffect(() => {
    // This effect now controls the entire loading cycle.
    setLoading(true);

    // Fetch the base 'main' portfolio document first.
    fetchBaseData();

    // If auth is still loading, wait.
    if (authLoading) {
      return;
    }
    
    // If there's no user, there's no need to listen for projects in the admin context.
    // We can stop loading.
    if (!user) {
        setLoading(false);
        return;
    }

    // Now, set up the real-time listener for projects.
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const projectsData: Project[] = [];
        querySnapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...(doc.data() as Omit<Project, 'id'>) });
        });
        
        // Merge the new projects list with the existing portfolio data.
        setPortfolioData(prevData => ({
            ...(prevData as PortfolioData), // We assume base data is fetched
            projects: projectsData,
        }));

        // Critical: stop loading after the first successful fetch (or if it's empty).
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching projects snapshot:", err);
        // Also stop loading on error.
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading, fetchBaseData]);

  const refreshPortfolioData = async () => {
    // This can just re-fetch the base data. The projects listener is real-time.
    await fetchBaseData();
  };


  return (
    <PortfolioDataContext.Provider value={{ portfolioData, loading, refreshPortfolioData }}>
      {process.env.NODE_ENV === 'development' && <FirebaseErrorListener />}
      {children}
    </PortfolioDataContext.Provider>
  );
}
