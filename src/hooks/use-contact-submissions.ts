
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ContactSubmission } from '@/lib/types';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import useAuth from './use-auth';

export default function useContactSubmissions() {
  const { user, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const submissionsData: ContactSubmission[] = [];
        querySnapshot.forEach((doc) => {
          submissionsData.push({ id: doc.id, ...(doc.data() as Omit<ContactSubmission, 'id'>) });
        });
        setSubmissions(submissionsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
          path: 'contactSubmissions',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);

        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  return { submissions, loading, error };
}
