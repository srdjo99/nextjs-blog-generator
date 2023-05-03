import { GetServerSideProps, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components/AppLayout';
import { FormEvent, ReactElement, useState } from 'react';
import type { NextPageWithLayout } from '../_app';
import { useRouter } from 'next/router';
import { getAppProps } from '../../utils/getAppProps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';

const NewPostPage: any = () => {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const response = await fetch(`/api/generatePost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, keywords }),
      });

      const json = await response.json();
      console.log('Result:', json);
      if (json?.postId) {
        router.push(`/post/${json.postId}`);
      }
    } catch (error) {
      console.log(error, 'client-err');
      setGenerating(false);
    }
  };

  return (
    <div className='h-full overflow-hidden'>
      {generating && (
        <div className='flex flex-col items-center justify-center w-full h-full text-green-500 animate-pulse'>
          <FontAwesomeIcon icon={faBrain} className='text-8xl' />
          <h6>Generating...</h6>
        </div>
      )}
      {!generating && (
        <div className='flex flex-col w-full h-full overflow-auto'>
          <form
            onSubmit={handleSubmit}
            className='w-full max-w-screen-sm p-4 m-auto border rounded-md shadow-xl bg-slate-100 border-slate-200 shadow-slate-200'
          >
            <div>
              <label>
                <strong>Generate a blog post on the topic of:</strong>
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={80}
                className='block w-full px-4 py-2 my-2 border rounded-sm resize-none border-slate-500'
              />
            </div>
            <div>
              <label>
                <strong>Targeting the following keywords:</strong>
              </label>
              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                maxLength={80}
                className='block w-full px-4 py-2 my-2 border rounded-sm resize-none border-slate-500'
              />
              <small className='block mb-2'>
                Separate keywords with a comma
              </small>
            </div>
            <button
              className='btn'
              type='submit'
              disabled={!topic.trim() || !keywords.trim()}
            >
              Generate
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

NewPostPage.getLayout = function getLayout(page: any, pageProps: any) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    if (!props.availableTokens) {
      return {
        redirect: {
          destination: '/token-topup',
          permanent: false,
        },
      };
    }
    return {
      props,
    };
  },
});

export default NewPostPage;
