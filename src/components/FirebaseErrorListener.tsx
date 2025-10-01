
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import type { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

// This is a client component that will listen for permission errors
// and throw them to be caught by the Next.js error overlay.
// This is only for development and should not be used in production.
export default function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error(
        'A Firestore permission error occurred. This will be thrown to the Next.js error overlay for debugging.',
        error.context
      );

      // We throw the error here to make it visible in the Next.js development error overlay.
      // This provides a better debugging experience than just logging to the console.
      throw error;
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null; // This component does not render anything.
}
