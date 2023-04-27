import type { ReactElement } from 'react';
import { GetServerSideProps } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../components/AppLayout';
import type { NextPageWithLayout } from './_app';

const TokenTopup: NextPageWithLayout = () => {
  return <div>topup post page</div>;
};

TokenTopup.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    return {
      props: {},
    };
  },
});

export default TokenTopup;
