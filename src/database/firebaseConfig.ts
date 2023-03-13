import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIRABASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: 'https://blog-kk-database.firebaseio.com'
});

export const db = admin.firestore();
export const auth = admin.auth();
