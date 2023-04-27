import { FC, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { Logo } from '../Logo';

type Props = {
  children?: ReactNode;
};

export const AppLayout: FC<Props> = ({ children }) => {
  const { user } = useUser();

  return (
    <div className='grid grid-cols-[300px_1fr] h-screen max-h-screen'>
      <div className='flex flex-col overflow-hidden text-white'>
        <div className='px-2 bg-slate-800'>
          <Logo />
          <Link href='/post/new' className='btn'>
            New post
          </Link>
          <Link href='/token-topup' className='block mt-2 text-center'>
            <FontAwesomeIcon icon={faCoins} className='text-yellow-500 ' />
            <span className='pl-1'> 0 tokens available</span>
          </Link>
        </div>
        <div className='flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800'>
          list of posts
        </div>
        <div className='flex items-center h-20 gap-2 px-2 border-t bg-cyan-800 border-t-black/50'>
          {!!user ? (
            <>
              <div className='min-w-[50px]'>
                <Image
                  priority
                  src={user.picture as string}
                  alt={user.name as string}
                  height={50}
                  width={50}
                  className='rounded-full'
                />
              </div>
              <div className='flex-1'>
                <div className='font-bold'>{user.email}</div>
                <Link className='text-sm' href='/api/auth/logout'>
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href='/api/auth/login'>Login</Link>
          )}
        </div>
      </div>
      <div className=''>{children}</div>
    </div>
  );
};
