import { GetServerSideProps, NextPage } from 'next';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const TokenTopup: NextPage = () => {
  return <div>new post page</div>;
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    return {
      props: {},
    };
  },
});

export default TokenTopup;
