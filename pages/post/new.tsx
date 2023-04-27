import { GetServerSideProps, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components/AppLayout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '../_app';

const NewPostPage: NextPageWithLayout = () => {
  return <div>new post page</div>;
};

NewPostPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    return {
      props: {},
    };
  },
});

export default NewPostPage;
