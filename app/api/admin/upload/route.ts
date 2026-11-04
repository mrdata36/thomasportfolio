import { randomUUID } from 'node:crypto';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isAdminAuthenticated, isSameOriginRequest } from '@/lib/admin-auth';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Could not read the uploaded file.' }, { status: 400 });
  }

  const file = formData.get('image');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Choose an image file to upload.' }, { status: 400 });
  const extension = allowedTypes[file.type];
  if (!extension) return NextResponse.json({ error: 'Use a JPEG, PNG, WebP, or GIF image.' }, { status: 400 });
  if (file.size === 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'The image must be smaller than 5 MB.' }, { status: 400 });
  }

  const contents = Buffer.from(await file.arrayBuffer());
  const isValidImage = {
    'image/jpeg': contents.length >= 3 && contents[0] === 0xff && contents[1] === 0xd8 && contents[2] === 0xff,
    'image/png': contents.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    'image/webp': contents.toString('ascii', 0, 4) === 'RIFF' && contents.toString('ascii', 8, 12) === 'WEBP',
    'image/gif': contents.toString('ascii', 0, 6) === 'GIF87a' || contents.toString('ascii', 0, 6) === 'GIF89a',
  }[file.type];
  if (!isValidImage) return NextResponse.json({ error: 'The uploaded file does not match its image type.' }, { status: 400 });

  const filename = `${randomUUID()}.${extension}`;
  try {
    const blob = await put(filename, contents, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (error) {
    console.error('Failed to save profile image:', error);
    return NextResponse.json({ error: 'Could not store the image. Check the Vercel Blob configuration.' }, { status: 500 });
  }
}
