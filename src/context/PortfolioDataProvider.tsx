
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
    try {
      const data = await getPortfolioData();
      return data;
    } catch (error) {
      console.error("Failed to fetch base portfolio data:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return; // Wait until auth state is resolved.
    }
    
    // This provider now only fetches data if a user is authenticated.
    // Public pages should rely on a simpler data fetching mechanism if needed,
    // or be wrapped in this provider on a page-by-page basis.
    if (!user) {
        setLoading(false); // Not an admin, stop loading.
        return;
    }

    // User is authenticated, proceed with fetching all data.
    setLoading(true);
    const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));

    const unsubscribeProjects = onSnapshot(projectsQuery, async (snapshot) => {
        const baseData = await fetchBaseData();
        if (!baseData) {
            setLoading(false);
            return;
        }

        const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        
        setPortfolioData({
            ...baseData,
            projects: projectsData,
        });

        setLoading(false);
    }, (err) => {
        console.error("Error fetching projects snapshot:", err);
        setLoading(false);
    });

    return () => {
      unsubscribeProjects();
    };
  }, [user, authLoading, fetchBaseData]);

  const refreshPortfolioData = useCallback(async () => {
    if (user) {
        setLoading(true);
        const baseData = await fetchBaseData();
        if (baseData) {
            // This assumes projects are still being listened to by the snapshot listener.
            // We just merge the refreshed base data.
            setPortfolioData(currentData => ({
                ...(currentData || {}),
                ...baseData,
                projects: currentData?.projects || []
            } as PortfolioData));
        }
        setLoading(false);
    }
  }, [fetchBaseData, user]);


  return (
    <PortfolioDataContext.Provider value={{ portfolioData, loading, refreshPortfolioData }}>
      {process.env.NODE_ENV === 'development' && <FirebaseErrorListener />}
      {children}
    </PortfolioDataContext.Provider>
  );
}
