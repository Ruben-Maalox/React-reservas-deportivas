import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ReservasPage() {
  const { data: session, status } = useSession();
  const isUserLoading = status === 'loading';
  const isUserSignedIn = !!session;
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !isUserSignedIn) {
      router.push('/login');
    }
  }, [isUserLoading, isUserSignedIn, router]);

  if (isUserLoading || !isUserSignedIn) {
    return null;
  }


  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-100 text-black">
      <h1>ESTA ES LA PÁGINA DE RESERVAS</h1>
      <p>En esta página se mostrarán las reservas disponibles (tienes que estar logeado)</p>
      <h1>{session?.user?.token}</h1>
    </main>
  );
}