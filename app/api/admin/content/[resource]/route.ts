import { NextResponse } from 'next/server';
import { isAdminAuthenticated, isSameOriginRequest } from '@/lib/admin-auth';
import { contentSchemas, type ContentResource } from '@/lib/content-validation';
import { db } from '@/lib/db';

type RouteContext = { params: Promise<{ resource: string }> };

function isResource(value: string): value is ContentResource {
  return Object.hasOwn(contentSchemas, value);
}

export async function POST(request: Request, { params }: RouteContext) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const { resource } = await params;
  if (!isResource(resource)) return NextResponse.json({ error: 'Unknown content type.' }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    let item: unknown;
    switch (resource) {
      case 'skills': {
        const parsed = contentSchemas.skills.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid content.' }, { status: 400 });
        item = await db.skill.create({ data: parsed.data });
        break;
      }
      case 'software-projects': {
        const parsed = contentSchemas['software-projects'].safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid content.' }, { status: 400 });
        item = await db.softwareProject.create({ data: parsed.data });
        break;
      }
      case 'media-gallery': {
        const parsed = contentSchemas['media-gallery'].safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid content.' }, { status: 400 });
        item = await db.graphicsMedia.create({ data: parsed.data });
        break;
      }
    }
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error(`Failed to create ${resource}:`, error);
    return NextResponse.json({ error: 'Could not save this item.' }, { status: 500 });
  }
}
