import { NextResponse } from 'next/server';
import { isAdminAuthenticated, isSameOriginRequest } from '@/lib/admin-auth';
import { contentSchemas, type ContentResource } from '@/lib/content-validation';
import { db } from '@/lib/db';

type RouteContext = { params: Promise<{ resource: string; id: string }> };

function isResource(value: string): value is ContentResource {
  return Object.hasOwn(contentSchemas, value);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const { resource, id } = await params;
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
        item = await db.skill.update({ where: { id }, data: parsed.data });
        break;
      }
      case 'software-projects': {
        const parsed = contentSchemas['software-projects'].safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid content.' }, { status: 400 });
        item = await db.softwareProject.update({ where: { id }, data: parsed.data });
        break;
      }
      case 'media-gallery': {
        const parsed = contentSchemas['media-gallery'].safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid content.' }, { status: 400 });
        item = await db.graphicsMedia.update({ where: { id }, data: parsed.data });
        break;
      }
    }
    return NextResponse.json({ item });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
    }
    console.error(`Failed to update ${resource} item:`, error);
    return NextResponse.json({ error: 'Could not update this item.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!isSameOriginRequest(_request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const { resource, id } = await params;
  if (!isResource(resource)) return NextResponse.json({ error: 'Unknown content type.' }, { status: 404 });

  try {
    switch (resource) {
      case 'skills': await db.skill.delete({ where: { id } }); break;
      case 'software-projects': await db.softwareProject.delete({ where: { id } }); break;
      case 'media-gallery': await db.graphicsMedia.delete({ where: { id } }); break;
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
    }
    console.error(`Failed to delete ${resource} item:`, error);
    return NextResponse.json({ error: 'Could not delete this item.' }, { status: 500 });
  }
}
