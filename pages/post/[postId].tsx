import { ReactElement, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { AppLayout } from '../../components/AppLayout';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { NextPageWithLayout } from '../_app';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { getAppProps } from '../../utils/getAppProps';
import { useRouter } from 'next/router';

const Post: any = ({
  postContent,
  metaDescription,
  title,
  keywords,
  id,
}: any) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/deletePost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const json = await response.json();

      if (json.success) {
        router.replace('/post/new');
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <div className='h-full overflow-auto'>
      <div className='max-w-screen-sm mx-auto'>
        <div className='p-2 mt-6 text-sm font-bold rounded-sm bg-stone-200'>
          SEO title and meta description
        </div>
        <div className='p-4 my-2 border rounded-md border-stone-200 '>
          <div className='text-2xl font-bold text-blue-600'>{title}</div>
          <div className='mt-2 '>{metaDescription}</div>
        </div>
        <div className='p-2 mt-6 text-sm font-bold rounded-sm bg-stone-200'>
          Keywords
        </div>
        <div className='flex flex-wrap gap-1 pt-2 '>
          {keywords.split(',').map((keyword: any, i: any) => (
            <div className='p-2 text-white rounded-full bg-slate-800' key={i}>
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </div>
          ))}
        </div>
        <div className='p-2 mt-6 text-sm font-bold rounded-sm bg-stone-200'>
          Blog post
        </div>
        <div dangerouslySetInnerHTML={{ __html: postContent || '' }} />
        <div className='my-4'>
          {!showDeleteConfirm && (
            <button
              className='bg-red-600 btn hover:bg-red-700'
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete post
            </button>
          )}
          {!!showDeleteConfirm && (
            <div>
              <p className='p-2 text-center bg-red-300'>
                Are you sure you want to delete this post? This action is
                irreversible
              </p>
              <div className='grid grid-cols-2 gap-2'>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className='btn bg-stone-600 hover:bg-stone-700'
                >
                  Cancel
                </button>
                <button
                  className='bg-red-600 btn hover:bg-red-700'
                  onClick={handleDeleteConfirm}
                >
                  Confirm delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Post.getLayout = function getLayout(page: any, pageProps: any) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db('BlogStandard');
    const user = await db.collection('users').findOne({
      auth0Id: userSession?.user.sub,
    });

    const post = await db.collection('posts').findOne({
      _id: new ObjectId(ctx?.params?.postId as string),
      userId: user?._id,
    });

    if (!post) {
      return {
        redirect: {
          destination: '/post/new',
          permanent: false,
        },
      };
    }

    return {
      props: {
        id: ctx.params?.postId,
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        postCreated: post.createdAt.toString(),
        ...props,
      },
    };
  },
});

export default Post;
