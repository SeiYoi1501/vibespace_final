/**
 * lib/auth.ts — hash mật khẩu SHA-256+salt và JWT HS256 thuần Web Crypto
 */

// ─── Password ──────────────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomUUID();
  const buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + password));
  const hex  = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${salt}:${hex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':');
  const buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + password));
  const hex  = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hex === hash;
}

// ─── JWT ───────────────────────────────────────────────────────────────────────

const SECRET = process.env.JWT_SECRET ?? 'vibespace-dev-secret-change-in-production';

function b64url(s: string) {
  return Buffer.from(s).toString('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return Buffer.from(sig).toString('base64url');
}

export interface TokenPayload { userId: string; email: string; exp: number; }

export async function createToken(userId: string, email: string): Promise<string> {
  const h = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = b64url(JSON.stringify({ userId, email, exp: Math.floor(Date.now()/1000) + 60*60*24*7 }));
  return `${h}.${p}.${await hmac(`${h}.${p}`)}`;
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const [h, p, sig] = token.split('.');
    if ((await hmac(`${h}.${p}`)) !== sig) return null;
    const data: TokenPayload = JSON.parse(Buffer.from(p, 'base64url').toString());
    return data.exp < Math.floor(Date.now()/1000) ? null : data;
  } catch { return null; }
}
