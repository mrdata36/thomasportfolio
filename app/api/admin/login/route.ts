import { NextResponse } from 'next/server';
import { createAdminSession, isSameOriginRequest, verifyAdminPassword } from '@/lib/admin-auth';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || !('password' in body) || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
  }

  try {
    if (!verifyAdminPassword(body.password)) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }
    await createAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin login configuration error:', error);
    return NextResponse.json({ error: 'Admin authentication is not configured correctly.' }, { status: 500 });
  }
}
