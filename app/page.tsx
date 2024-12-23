import { redirect } from 'next/navigation';
import { getAccessToken } from './api/utils/getAccessToken';
import LogoutButton from './components/LogoutButton';

async function getData() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return null;
  }

  const res = await fetch(`${process.env.BASE_URL}/api/users/profile`, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();

  return data;

}

export default async function Home() {
  const data = await getData();

  if (!data) {
    redirect('/login');
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Hello to {data.username}! 👋</p>
        <LogoutButton/>
      </div>
    </>
  )
}