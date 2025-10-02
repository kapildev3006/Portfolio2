
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

  const refreshPortfolioData = useCallback(async () => {
    try {
      const data = await getPortfolioData();
      setPortfolioData(prevData => ({
        ...data,
        projects: prevData?.projects || [],
      }));
    } catch (error) {
      console.error("Failed to refresh portfolio data:", error);
    }
  }, []);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      // For public pages, fetch data but don't listen for real-time updates
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
             setPortfolioData(baseData as PortfolioData);
             setLoading(false);
        });
        return unsubscribe;
      };
      const unsubscribePromise = fetchPublicData();
      return () => {
        unsubscribePromise.then(unsub => unsub());
      }
    }

    // --- Authenticated User Logic ---
    setLoading(true);
    let unsubscribeProjects: () => void = () => {};

    // 1. Fetch the base non-project data
    getPortfolioData().then(baseData => {
      // Set initial data without projects
      setPortfolioData({ ...baseData, projects: [] });

      // 2. Set up the real-time listener for projects
      const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      unsubscribeProjects = onSnapshot(projectsQuery, 
        (snapshot) => {
          const projectsData: Project[] = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Project, 'id'>) }));
          
          // Merge projects with the already set base data
          setPortfolioData(currentData => ({
            ...(currentData as PortfolioData),
            projects: projectsData,
          }));

          setLoading(false); // Stop loading after the first successful fetch
        },
        (err) => {
          console.error("Error fetching projects snapshot:", err);
          setLoading(false); // Also stop loading on error
        }
      );
    }).catch(err => {
      console.error("Error fetching base portfolio data:", err);
      setLoading(false);
    });

    return () => {
      unsubscribeProjects();
    };
  }, [user, authLoading]);


  return (
    <PortfolioDataContext.Provider value={{ portfolioData, loading, refreshPortfolioData }}>
      {process.env.NODE_ENV === 'development' && <FirebaseErrorListener />}
      {children}
    </PortfolioDataContext.Provider>
  );
}
