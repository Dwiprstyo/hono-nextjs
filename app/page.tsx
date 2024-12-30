import { redirect } from 'next/navigation';
import { getAccessToken } from './api/utils/getAccessToken';
import LogoutButton from './components/LogoutButton';
import DonutScene from "./components/Scene/DonutScene";

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
    <div className="relative min-h-screen">
      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-50">
        <LogoutButton />
      </div>

      {/* Donut Scene */}
      <div className="absolute inset-0">
        <DonutScene name={data.username} />
      </div>
    </div>
  );

}
