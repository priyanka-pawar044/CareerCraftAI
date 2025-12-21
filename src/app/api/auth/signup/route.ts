
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { initializeFirebaseAdmin } from '@/firebase/admin';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Ensure Firebase Admin is initialized
const { firestore } = initializeFirebaseAdmin();

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json({ message: 'Email is already in use' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // This data object will be added to Firestore first, without the ID.
    const newUser = {
      name,
      email,
      passwordHash,
      authProvider: 'password',
      lastLogin: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(firestore, 'users'), newUser);
    
    // Now, update the newly created document to include its own ID.
    await updateDoc(docRef, { id: docRef.id });
    
    const userPayload = { id: docRef.id, name, email };
    
    // Create JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set.');
    }
    const token = sign(userPayload, secret, { expiresIn: '7d' });

    // Set cookie
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
