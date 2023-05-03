import type { ReactElement } from 'react';
import { GetServerSideProps } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../components/AppLayout';
import type { NextPageWithLayout } from './_app';
import { getAppProps } from '../utils/getAppProps';

const TokenTopup: any = () => {
  const handleClick = async (e: any) => {
    e.preventDefault();
    const response = await fetch(`/api/addTokens`, {
      method: 'POST',
      headers: {},
    });
    const json = await response.json();
    console.log(json, 'json');
    window.location.href = json.session.url;
  };

  return (
    <div>
      <h1>this is the token topup</h1>
      <button className='btn' onClick={handleClick}>
        Add tokens
      </button>
    </div>
  );
};

TokenTopup.getLayout = function getLayout(page: any, pageProps: any) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});

export default TokenTopup;
