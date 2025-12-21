
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import * as admin from 'firebase-admin';

// Helper function to initialize Firebase Admin SDK
const initializeAdmin = () => {
  if (admin.apps.length > 0) {
    return { firestore: admin.firestore() };
  }

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
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    throw new Error('Failed to initialize Firebase Admin SDK.');
  }
  return { firestore: admin.firestore() };
};


export async function POST(request: Request) {
  let firestore: admin.firestore.Firestore;
  try {
    firestore = initializeAdmin().firestore;
  } catch (error: any) {
    console.error("Firebase Admin Init Error:", error);
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password are required' }, { status: 400 });
    }

    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json({ message: 'Email is already in use' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      passwordHash,
      authProvider: 'password',
      lastLogin: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(firestore, 'users'), newUser);
    
    await updateDoc(docRef, { id: docRef.id });
    
    const userPayload = { id: docRef.id, name, email };
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set.');
    }
    const token = sign(userPayload, secret, { expiresIn: '7d' });

    cookies().set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json({ message: 'User created successfully', user: userPayload }, { status: 201 });

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
