import { cookies } from 'next/headers';

export async function getAccessToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access-token')?.value;

  return accessToken;
}
