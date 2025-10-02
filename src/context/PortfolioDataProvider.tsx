
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
      setLoading(true);
      const data = await getPortfolioData();
      setPortfolioData(data);
    } catch (error) {
      console.error("Failed to refresh portfolio data:", error);
    } finally {
        // We will let the project listener set loading to false
    }
  }, []);

  useEffect(() => {
    // This effect runs when auth state changes.
    if (authLoading) {
      setLoading(true);
      return; // Wait until auth state is resolved
    }

    // Unauthenticated user flow
    if (!user) {
      const fetchPublicData = async () => {
        setLoading(true);
        const baseData = await getPortfolioData();
        const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
            setPortfolioData({
                ...baseData,
                projects: projectsData
            });
            setLoading(false);
        }, (err) => {
             console.error("Error fetching public project data:", err);
             setPortfolioData(baseData as PortfolioData); // Set base data even on error
             setLoading(false);
        });
        return unsubscribe;
      };
      const unsubscribePromise = fetchPublicData();
      return () => {
        unsubscribePromise.then(unsub => unsub());
      };
    }

    // Authenticated user flow
    let unsubscribeProjects: () => void = () => {};

    const fetchAdminData = async () => {
        setLoading(true);
        const baseData = await getPortfolioData();

        // Base data is ready, now listen for projects
        const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
            setPortfolioData({
                ...baseData,
                projects: projectsData
            });
            setLoading(false); // Data is ready, stop loading
        }, (err) => {
            console.error("Error fetching projects snapshot:", err);
            setPortfolioData(baseData as PortfolioData); // Set base data even on error
            setLoading(false);
        });
    }

    fetchAdminData();
    
    return () => {
      unsubscribeProjects();
    };
  }, [user, authLoading]);

  const refreshPortfolioData = useCallback(async () => {
    await fetchBaseData();
  }, [fetchBaseData]);


  return (
    <PortfolioDataContext.Provider value={{ portfolioData, loading, refreshPortfolioData }}>
      {process.env.NODE_ENV === 'development' && <FirebaseErrorListener />}
      {children}
    </PortfolioDataContext.Provider>
  );
}
