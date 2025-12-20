
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('session_token');

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET is not set');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  try {
    const decoded = verify(token.value, secret);
    return NextResponse.json({ user: decoded });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
