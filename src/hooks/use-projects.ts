
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project as ProjectType } from '@/lib/types';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import useAuth from './use-auth';

export interface Project extends ProjectType {
    id: string;
    createdAt?: Timestamp;
}

export default function useProjects() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (authLoading) {
      // Wait for authentication to resolve
      return;
    }

    if (!user) {
      // If no user is logged in, do not attempt to fetch projects.
      // This prevents permission errors for unauthenticated users.
      setLoading(false);
      setProjects([]);
      return;
    }

    setLoading(true);
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
        const permissionError = new FirestorePermissionError({
          path: 'projects',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);

        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  return { projects, loading, error };
}
