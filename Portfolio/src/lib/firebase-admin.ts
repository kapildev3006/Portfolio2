
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

let adminDb: admin.firestore.Firestore | null = null;

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (serviceAccountKey) {
    try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }
        adminDb = getFirestore();
    } catch (error) {
        console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", error);
        console.warn("Firebase Admin SDK not initialized due to malformed service account key.");
    }
} else {
    console.warn("Firebase Admin SDK not initialized. FIREBASE_SERVICE_ACCOUNT_KEY is missing.");
}


export { adminDb };
