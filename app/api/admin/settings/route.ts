import { NextResponse } from 'next/server';
import { isAdminAuthenticated, isSameOriginRequest } from '@/lib/admin-auth';
import { portfolioSettingsSchema } from '@/lib/content-validation';
import { db } from '@/lib/db';

export async function PUT(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = portfolioSettingsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid settings.' }, { status: 400 });

  try {
    const settings = await db.portfolioSettings.upsert({
      where: { id: 'main' },
      create: { id: 'main', ...parsed.data },
      update: parsed.data,
    });
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Failed to update portfolio settings:', error);
    return NextResponse.json({ error: 'Could not save home page settings.' }, { status: 500 });
  }
}
