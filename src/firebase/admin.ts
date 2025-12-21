'use server';

import * as admin from 'firebase-admin';

// This function initializes the Firebase Admin SDK.
// It's designed to be idempotent (safe to call multiple times).
export function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return {
      firestore: admin.firestore(),
      auth: admin.auth(),
    };
  }

  // Ensure all required environment variables are present.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('The FIREBASE_PRIVATE_KEY environment variable is not set.');
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  if (!clientEmail) {
    throw new Error('The FIREBASE_CLIENT_EMAIL environment variable is not set.');
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('The FIREBASE_PROJECT_ID environment variable is not set.');
  }
  
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        // The private key must be correctly formatted.
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    throw new Error('Failed to initialize Firebase Admin SDK. Check server logs.');
  }

  return {
    firestore: admin.firestore(),
    auth: admin.auth(),
  };
}
