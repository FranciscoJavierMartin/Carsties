import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
