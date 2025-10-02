
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
    // This effect should only run when the user's authentication status is fully resolved.
    // We wait until authLoading is false.
    if (authLoading) {
      setLoading(true);
      return;
    }

    // If there is no authenticated user, we should not attempt to fetch the data.
    // We clear any existing submissions, stop loading, and return.
    if (!user) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    // At this point, we know we have an authenticated user.
    // We can now safely create the query and set up the listener.
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
        // If an error occurs, it's likely a permissions issue.
        // We create a detailed error and emit it for debugging.
        const permissionError = new FirestorePermissionError({
          path: 'contactSubmissions',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);

        setError(err);
        setLoading(false);
      }
    );

    // The cleanup function will be called when the component unmounts
    // or when the dependencies (user, authLoading) change.
    return () => unsubscribe();
  }, [user, authLoading]); // Rerun the effect if the user or loading state changes.

  return { submissions, loading, error };
}
