
'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { PortfolioData, Project } from '@/lib/types';
import { getPortfolioData } from '@/lib/portfolio-data';
import FirebaseErrorListener from '@/components/FirebaseErrorListener';
import { onSnapshot, collection, query, orderBy, doc } from 'firebase/firestore';
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
    setLoading(true);
    const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));

    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        setPortfolioData(current => ({
            ...(current || {
                hero: {} as any,
                about: { subtitle: '', skills: [], experience: [] },
                achievements: [],
                contact: { email: '', phone: '', location: '' },
                socials: { linkedin: '', github: '', twitter: '' },
                services: [],
                testimonials: [],
            }),
            projects: projectsData
        } as PortfolioData));
    }, (err) => {
        console.error("Error fetching projects snapshot:", err);
    });

    const unsubscribeBase = onSnapshot(doc(db, 'portfolio', 'main'), async (snapshot) => {
        const baseData = await fetchBaseData();
        if (baseData) {
            setPortfolioData(current => ({
                ...(current || { projects: [] }),
                ...baseData,
                projects: current?.projects || []
            } as PortfolioData));
        }
        setLoading(false);
    }, (err) => {
        console.error("Error fetching base snapshot:", err);
        setLoading(false);
    });

    return () => {
      unsubscribeProjects();
      unsubscribeBase();
    };
  }, [fetchBaseData]);


  const refreshPortfolioData = useCallback(async () => {
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
  }, [fetchBaseData]);


  return (
    <PortfolioDataContext.Provider value={{ portfolioData, loading, refreshPortfolioData }}>
      {process.env.NODE_ENV === 'development' && user && <FirebaseErrorListener />}
      {children}
    </PortfolioDataContext.Provider>
  );
}
