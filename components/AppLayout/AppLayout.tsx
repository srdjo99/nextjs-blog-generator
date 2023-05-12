import { FC, ReactNode, useContext, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { Logo } from '../Logo';
import PostsContext from '../../context/postsContext';

type Props = {
  children?: ReactNode;
};

export const AppLayout: FC<any> = ({
  children,
  availableTokens,
  posts,
  postId,
  postCreated,
}) => {
  const { user } = useUser();

  const {
    posts: postsFromSSR,
    getPosts,
    setPostsFromSSR,
    noMorePosts,
  }: any = useContext(PostsContext);

  useEffect(() => {
    setPostsFromSSR(postsFromSSR);
    if (postId) {
      const exists = postsFromSSR.find((post: any) => post._id === postId);
      if (!exists) {
        getPosts({ getNewerPosts: true, lastPostDate: postCreated });
      }
    }
  }, [getPosts, setPostsFromSSR, posts, postId, postCreated]);

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
            <span className='pl-1'> {availableTokens} tokens available</span>
          </Link>
        </div>
        <div className='flex-1 px-4 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800'>
          {posts?.map((post: any) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className={` py-1 border border-white/0 block px-2 my-1 overflow-hidden rounded-sm cursor-pointer text-ellipsis whitespace-nowrap bg-white/10
              ${postId === post._id ? 'bg-white/20 border-white' : ''}
              `}
            >
              {post.topic}
            </Link>
          ))}
          {!noMorePosts && (
            <div
              onClick={() =>
                getPosts({ lastPostDate: posts[posts.length - 1].createdAt })
              }
              className='mt-4 text-sm text-center cursor-pointer hover:underline text-slate-400'
            >
              Load more posts
            </div>
          )}
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
      {children}
    </div>
  );
};
