import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';
import { NextApiRequest } from 'next';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  let user: any;

  try {
    const session = await getSession();
    user = session?.user || null;
  } catch (error) {
    user = null;
  }

  return user;
}

export async function getTokenWorkaround() {
  const req = {
    headers: Object.fromEntries(headers() as Headers),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value])
    ),
  } as NextApiRequest;

  return await getToken({ req });
}
