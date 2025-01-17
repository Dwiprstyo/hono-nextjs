import { cookies } from 'next/headers';

export async function getAccessToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('hono_session')?.value;

  return accessToken;
}
