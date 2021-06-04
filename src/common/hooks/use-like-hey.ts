import { useLoading } from '@hooks/use-loading';
import { LOADING_KEYS, showPendingOverlayAtom } from '@store/ui';
import { FinishedTxPayload, useConnect } from '@stacks/connect-react';
import { useNetwork } from '@hooks/use-network';
import { useCallback } from 'react';
import {
  createAssetInfo,
  createFungiblePostCondition,
  FungibleConditionCode,
  uintCV,
} from '@stacks/transactions';
import { useUpdateAtom } from 'jotai/utils';
import { useCurrentAddress } from '@hooks/use-current-address';
import { useHeyContract } from '@hooks/use-hey-contract';
import { LIKE_FUNCTION } from '@common/constants';
import BN from 'bn.js';
import { toast } from 'react-hot-toast';

export function useHandleLikeHey() {
  const setShowPendingOverlay = useUpdateAtom(showPendingOverlayAtom);
  const address = useCurrentAddress();
  const [contractAddress, contractName] = useHeyContract();
  const { setIsLoading } = useLoading(LOADING_KEYS.CLAIM_HEY);
  const { doContractCall } = useConnect();
  const network = useNetwork();
  const onFinish = useCallback(() => {
    toast.success('Your like has been submitted!');
    void setIsLoading(false);
    void setShowPendingOverlay(false);
  }, [setIsLoading, setShowPendingOverlay, toast]);
  const onCancel = useCallback(() => {
    void setIsLoading(false);
    void setShowPendingOverlay(false);
  }, [setIsLoading, setShowPendingOverlay]);

  return useCallback(
    (id: number) => {
      void setShowPendingOverlay(true);
      void setIsLoading(true);

      void doContractCall({
        contractAddress,
        contractName,
        functionName: LIKE_FUNCTION,
        functionArgs: [uintCV(id)],
        postConditions: [
          createFungiblePostCondition(
            address,
            FungibleConditionCode.Equal,
            new BN(1),
            createAssetInfo(contractAddress, 'hey-token', 'hey-token')
          ),
        ],
        onFinish,
        onCancel,
        network,
        stxAddress: address,
      });
    },
    [setIsLoading, onFinish, network, onCancel, address, doContractCall]
  );
}
