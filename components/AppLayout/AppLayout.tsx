import { FC, ReactNode } from 'react';

type Props = {
  children?: any;
};

export const AppLayout = ({ children }: any) => {
  return (
    <div>
      this is the app layout <div>{children}</div>
    </div>
  );
};
