import { useUser } from '@hooks/use-user';
import { useLoading } from '@hooks/use-loading';
import { LOADING_KEYS } from '@store/ui';
import { useConnect } from '@stacks/connect-react';
import { useNetwork } from '@hooks/use-network';
import { useCallback } from 'react';

export function useHandleClaimHey() {
  const { addresses } = useUser(); // something like this
  const { setIsLoading } = useLoading(LOADING_KEYS.CLAIM_HEY);
  const { doContractCall } = useConnect();
  const network = useNetwork();
  const onFinish = useCallback(() => {
    void setIsLoading(false);
  }, [setIsLoading]);
  const onCancel = useCallback(() => {
    void setIsLoading(false);
  }, [setIsLoading]);

  return useCallback(() => {
    void setIsLoading(true);
    void doContractCall({
      contractAddress: 'ST21FTC82CCKE0YH9SK5SJ1D4XEMRA069FKV0VJ8N',
      contractName: 'heystack-token',
      functionName: 'faucet',
      functionArgs: [],
      onFinish,
      onCancel,
      network,
      stxAddress: addresses?.testnet,
    });
  }, [setIsLoading, onFinish, network, onCancel, addresses, doContractCall]);
}
