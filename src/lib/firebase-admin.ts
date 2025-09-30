
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // You might need to provide your database URL here if not using a service account
    // databaseURL: `https://<DATABASE_NAME>.firebaseio.com`
  });
}

const adminDb = getFirestore();

export { adminDb };
