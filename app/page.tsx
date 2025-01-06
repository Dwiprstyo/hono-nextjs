import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAccessToken } from './api/utils/access-token';
import LogoutButton from './components/LogoutButton';
import DonutScene from "./components/Scene/DonutScene";
import Loading from './components/ui/Loading';

async function ProfileContent() {
  const { accessToken, response } = await getData() || {};
  const data = response?.data;

  if (!data) {
    redirect('/login');
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4 z-50">
        <LogoutButton accessToken={accessToken || ''}/>
      </div>
      <div className="absolute inset-0">
        <DonutScene name={data.name} />
      </div>
    </div>
  );
}

async function getData() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return null;
  }

  const res = await fetch(`${process.env.BASE_URL}/api/users/profiles`, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const response = await res.json();
  return { accessToken, response };
}

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileContent />
    </Suspense>
  );
}