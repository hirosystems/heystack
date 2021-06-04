import { Button } from '@components/button';
import React from 'react';
import { useLoading } from '@hooks/use-loading';
import { LOADING_KEYS } from '@store/ui';
import { useHandleClaimHey } from '@hooks/use-claim-hey';
import { ButtonProps } from '@stacks/ui';

export const ClaimHeyButton = (props: ButtonProps) => {
  const { isLoading } = useLoading(LOADING_KEYS.CLAIM_HEY);
  const handleFaucetCall = useHandleClaimHey();
  return (
    <Button isLoading={isLoading} onClick={handleFaucetCall} {...props}>
      Claim HEY
    </Button>
  );
};
