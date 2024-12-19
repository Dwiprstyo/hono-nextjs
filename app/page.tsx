async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hello`, {
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function Home() {
  const { message } = await getData()

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>{message}</p>
    </div>
  )
}