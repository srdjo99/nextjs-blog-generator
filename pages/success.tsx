import type { ReactElement } from 'react';
import { GetServerSideProps } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../components/AppLayout';
import type { NextPageWithLayout } from './_app';
import { getAppProps } from '../utils/getAppProps';

const Success: any = () => {
  return (
    <div>
      <h1>Thank you for your purchase</h1>
    </div>
  );
};

Success.getLayout = function getLayout(page: any, pageProps: any) {
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

export default Success;
