import { useLoading } from '@hooks/use-loading';
import { LOADING_KEYS } from '@store/ui';
import { useConnect } from '@stacks/connect-react';
import { useNetwork } from '@hooks/use-network';
import { useCallback } from 'react';
import { useHeyContract } from '@hooks/use-hey-contract';
import { REQUEST_FUNCTION } from '@common/constants';
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';
import { useCurrentAddress } from '@hooks/use-current-address';

export function useHandleClaimHey() {
  const address = useCurrentAddress();
  const { setIsLoading } = useLoading(LOADING_KEYS.CLAIM_HEY);
  const { doContractCall } = useConnect();
  const [contractAddress, contractName] = useHeyContract();
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
      contractAddress,
      contractName,
      functionName: REQUEST_FUNCTION,
      functionArgs: [principalCV(address)],
      onFinish,
      onCancel,
      network,
      stxAddress: address,
    });
  }, [setIsLoading, onFinish, network, onCancel, address, doContractCall]);
}
