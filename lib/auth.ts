import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/lib/config';

const AUTH_BASE = `${API_BASE_URL}/api/auth`;
const KEY_SESSION = 'bullsye_session_token';
const KEY_JWT = 'bullsye_jwt';
const KEY_USER = 'bullsye_user';
const KEY_COOKIE = 'bullsye_cookie_jar';

/** Neon Auth / Better Auth session cookie name */
const SESSION_COOKIE = '__Secure-neon-auth.session_token';

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: boolean;
};

type AuthResult = {
  user: AuthUser | null;
  sessionToken: string | null;
  jwt: string | null;
  error?: string;
};

function pickUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== 'object') return null;
  const u = raw as Record<string, unknown>;
  if (typeof u.id !== 'string' || typeof u.email !== 'string') return null;
  return {
    id: u.id,
    email: u.email,
    name: typeof u.name === 'string' ? u.name : null,
    image: typeof u.image === 'string' ? u.image : null,
    emailVerified: Boolean(u.emailVerified),
  };
}

function pickSessionToken(body: Record<string, unknown>): string | null {
  const session = body.session as Record<string, unknown> | undefined;
  if (session && typeof session.token === 'string') return session.token;
  const data = body.data as Record<string, unknown> | undefined;
  const nested = data?.session as Record<string, unknown> | undefined;
  if (nested && typeof nested.token === 'string') return nested.token;
  return null;
}

function pickUserFromBody(body: Record<string, unknown>): AuthUser | null {
  return (
    pickUser(body.user) ||
    pickUser((body.data as Record<string, unknown> | undefined)?.user)
  );
}

function parseSetCookie(header: string | null): string | null {
  if (!header) return null;
  // May be multiple cookies joined; keep name=value pairs for Cookie header
  const parts = header.split(/,(?=\s*[^;=]+=[^;]+)/);
  const pairs: string[] = [];
  for (const part of parts) {
    const nv = part.split(';')[0]?.trim();
    if (nv?.includes('=')) pairs.push(nv);
  }
  return pairs.length ? pairs.join('; ') : null;
}

async function persistAuth(opts: {
  user?: AuthUser | null;
  sessionToken?: string | null;
  jwt?: string | null;
  cookieJar?: string | null;
}) {
  if (opts.user) {
    await SecureStore.setItemAsync(KEY_USER, JSON.stringify(opts.user));
  } else if (opts.user === null) {
    await SecureStore.deleteItemAsync(KEY_USER);
  }
  if (opts.sessionToken) {
    await SecureStore.setItemAsync(KEY_SESSION, opts.sessionToken);
  } else if (opts.sessionToken === null) {
    await SecureStore.deleteItemAsync(KEY_SESSION);
  }
  if (opts.jwt) {
    await SecureStore.setItemAsync(KEY_JWT, opts.jwt);
  } else if (opts.jwt === null) {
    await SecureStore.deleteItemAsync(KEY_JWT);
  }
  if (opts.cookieJar) {
    await SecureStore.setItemAsync(KEY_COOKIE, opts.cookieJar);
  } else if (opts.cookieJar === null) {
    await SecureStore.deleteItemAsync(KEY_COOKIE);
  }
}

export async function loadStoredAuth(): Promise<{
  user: AuthUser | null;
  sessionToken: string | null;
  jwt: string | null;
}> {
  const [userRaw, sessionToken, jwt] = await Promise.all([
    SecureStore.getItemAsync(KEY_USER),
    SecureStore.getItemAsync(KEY_SESSION),
    SecureStore.getItemAsync(KEY_JWT),
  ]);
  let user: AuthUser | null = null;
  if (userRaw) {
    try {
      user = pickUser(JSON.parse(userRaw));
    } catch {
      user = null;
    }
  }
  return { user, sessionToken, jwt };
}

async function buildCookieHeader(sessionToken?: string | null): Promise<string | undefined> {
  const jar = await SecureStore.getItemAsync(KEY_COOKIE);
  if (jar) return jar;
  const token =
    sessionToken ?? (await SecureStore.getItemAsync(KEY_SESSION));
  if (token) return `${SESSION_COOKIE}=${token}`;
  return undefined;
}

async function authFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const cookie = await buildCookieHeader();
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (cookie) headers.set('Cookie', cookie);

  return fetch(`${AUTH_BASE}${path}`, {
    ...init,
    headers,
  });
}

async function handleAuthResponse(res: Response): Promise<AuthResult> {
  const text = await res.text();
  let body: Record<string, unknown> = {};
  try {
    body = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    body = {};
  }

  if (!res.ok) {
    const message =
      (typeof body.message === 'string' && body.message) ||
      (typeof body.error === 'string' && body.error) ||
      `İstek başarısız (${res.status})`;
    return { user: null, sessionToken: null, jwt: null, error: message };
  }

  const setCookie = parseSetCookie(res.headers.get('set-cookie'));
  const jwtHeader =
    res.headers.get('set-auth-jwt') ||
    res.headers.get('Set-Auth-Jwt');

  let sessionToken = pickSessionToken(body);
  if (!sessionToken && setCookie) {
    const m = setCookie.match(
      new RegExp(`${SESSION_COOKIE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]+)`)
    );
    if (m?.[1]) sessionToken = decodeURIComponent(m[1]);
  }

  const user = pickUserFromBody(body);
  const jwt =
    jwtHeader ||
    (typeof (body.session as { token?: string } | undefined)?.token ===
    'string'
      ? (body.session as { token: string }).token
      : null);

  await persistAuth({
    user: user ?? undefined,
    sessionToken: sessionToken ?? undefined,
    jwt: jwt ?? undefined,
    cookieJar: setCookie ?? (sessionToken ? `${SESSION_COOKIE}=${sessionToken}` : undefined),
  });

  return {
    user,
    sessionToken,
    jwt,
  };
}

export async function signInEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const res = await authFetch('/sign-in/email', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
  return handleAuthResponse(res);
}

export async function signUpEmail(
  email: string,
  password: string,
  name: string
): Promise<AuthResult> {
  const res = await authFetch('/sign-up/email', {
    method: 'POST',
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
      name: name.trim() || email.split('@')[0],
    }),
  });
  return handleAuthResponse(res);
}

export async function fetchSession(): Promise<AuthResult> {
  try {
    const res = await authFetch('/get-session', { method: 'GET' });
    if (res.status === 401 || res.status === 404) {
      return { user: null, sessionToken: null, jwt: null };
    }
    const text = await res.text();
    if (!text || text === 'null') {
      return { user: null, sessionToken: null, jwt: null };
    }
    let body: Record<string, unknown> = {};
    try {
      body = JSON.parse(text) as Record<string, unknown>;
    } catch {
      return { user: null, sessionToken: null, jwt: null };
    }
    const user =
      pickUser(body.user) ||
      pickUser((body.data as Record<string, unknown> | undefined)?.user);
    const sessionToken = pickSessionToken(body);
    if (user) {
      await persistAuth({
        user,
        sessionToken: sessionToken ?? undefined,
      });
    }
    return {
      user,
      sessionToken,
      jwt: await SecureStore.getItemAsync(KEY_JWT),
    };
  } catch (e) {
    return {
      user: null,
      sessionToken: null,
      jwt: null,
      error: e instanceof Error ? e.message : 'network',
    };
  }
}

export async function signOut(): Promise<void> {
  try {
    await authFetch('/sign-out', { method: 'POST', body: '{}' });
  } catch {
    // ignore network errors on logout
  }
  await persistAuth({
    user: null,
    sessionToken: null,
    jwt: null,
    cookieJar: null,
  });
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const jwt = await SecureStore.getItemAsync(KEY_JWT);
  const cookie = await buildCookieHeader();
  const headers: Record<string, string> = {};
  if (jwt) headers.Authorization = `Bearer ${jwt}`;
  if (cookie) headers.Cookie = cookie;
  return headers;
}
