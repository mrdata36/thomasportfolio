import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'portfolio_admin';
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must be set to at least 32 characters.');
  }
  return secret;
}

function signature(expiresAt: string) {
  return createHmac('sha256', getSecret()).update(expiresAt).digest('hex');
}

export function verifyAdminPassword(password: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) throw new Error('ADMIN_PASSWORD is not configured.');

  const supplied = createHmac('sha256', getSecret()).update(password).digest();
  const expected = createHmac('sha256', getSecret()).update(configuredPassword).digest();
  return timingSafeEqual(supplied, expected);
}

export async function createAdminSession() {
  const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${expiresAt}.${signature(expiresAt)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;

  const [expiresAt, suppliedSignature, extra] = value.split('.');
  if (!expiresAt || !suppliedSignature || extra || !/^\d+$/.test(expiresAt)) return false;
  if (Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;

  const expected = Buffer.from(signature(expiresAt), 'hex');
  const supplied = Buffer.from(suppliedSignature, 'hex');
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
