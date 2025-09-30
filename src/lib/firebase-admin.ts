
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

let adminDb: admin.firestore.Firestore | null = null;

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (serviceAccountKey) {
    const serviceAccount = JSON.parse(serviceAccountKey);
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
    adminDb = getFirestore();
} else {
    console.warn("Firebase Admin SDK not initialized. FIREBASE_SERVICE_ACCOUNT_KEY is missing.");
}


export { adminDb };
