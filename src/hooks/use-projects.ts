
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project as ProjectType } from '@/lib/types';

export interface Project extends ProjectType {
    id: string;
    createdAt?: Timestamp;
}

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const projectsData: Project[] = [];
        querySnapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...(doc.data() as Project) });
        });
        setProjects(projectsData);
        setLoading(false);
      },
      (err) => {
        // No longer logging the generic error to the console.
        // The framework will catch and display a detailed contextual error.
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { projects, loading, error };
}
