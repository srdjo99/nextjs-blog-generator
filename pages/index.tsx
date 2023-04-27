import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {
  const { user } = useUser();

  console.log(user);

  return (
    <div>
      <h1>Homepage</h1>
      <div>
        {!!user ? (
          <>
            <div>
              <Image
                priority
                src={user.picture as string}
                alt={user.name as string}
                height={50}
                width={50}
              />
              <div>{user.email}</div>
            </div>
            <Link href='/api/auth/logout'>Logout</Link>
          </>
        ) : (
          <Link href='/api/auth/login'>Login</Link>
        )}
      </div>
    </div>
  );
}
