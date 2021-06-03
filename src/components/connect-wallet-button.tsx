import { Button } from '@components/button';
import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { ButtonProps } from '@stacks/ui';
import { useLoading } from '@hooks/use-loading';
import { LOADING_KEYS } from '@store/ui';

export const ConnectWalletButton: React.FC<ButtonProps> = props => {
  const { doOpenAuth } = useConnect();
  const { isLoading, setIsLoading } = useLoading(LOADING_KEYS.AUTH);
  return (
    <Button
      isLoading={isLoading}
      onClick={() => {
        void setIsLoading(true);
        doOpenAuth();
      }}
      {...props}
    >
      Connect wallet
    </Button>
  );
};
