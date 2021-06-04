import { useLoading } from '@hooks/use-loading';
import { LOADING_KEYS, showPendingOverlayAtom } from '@store/ui';
import { useConnect } from '@stacks/connect-react';
import { useNetwork } from '@hooks/use-network';
import { useCallback } from 'react';
import {
  createAssetInfo,
  createFungiblePostCondition,
  FungibleConditionCode,
  noneCV,
  someCV,
  stringUtf8CV,
} from '@stacks/transactions';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { useCurrentAddress } from '@hooks/use-current-address';
import { useHeyContract } from '@hooks/use-hey-contract';
import { MESSAGE_FUNCTION } from '@common/constants';
import BN from 'bn.js';
import { attachmentUriAtom } from '@store/feed';

export function useHandlePublishContent() {
  const setShowPendingOverlay = useUpdateAtom(showPendingOverlayAtom);
  const attachmentUri = useAtomValue(attachmentUriAtom);
  const address = useCurrentAddress();
  const [contractAddress, contractName] = useHeyContract();
  const { setIsLoading } = useLoading(LOADING_KEYS.CLAIM_HEY);
  const { doContractCall } = useConnect();
  const network = useNetwork();
  const onFinish = useCallback(() => {
    void setIsLoading(false);
    void setShowPendingOverlay(false);
  }, [setIsLoading, setShowPendingOverlay]);
  const onCancel = useCallback(() => {
    void setIsLoading(false);
    void setShowPendingOverlay(false);
  }, [setIsLoading, setShowPendingOverlay]);

  return useCallback(
    (content: string, _onFinish: () => void) => {
      void setShowPendingOverlay(true);
      void setIsLoading(true);

      void doContractCall({
        contractAddress,
        contractName,
        functionName: MESSAGE_FUNCTION,
        functionArgs: [
          stringUtf8CV(content),
          attachmentUri !== '' ? someCV(stringUtf8CV(attachmentUri)) : noneCV(),
        ],
        onFinish: () => {
          _onFinish();
          onFinish();
        },
        postConditions: [
          createFungiblePostCondition(
            address,
            FungibleConditionCode.Equal,
            new BN(1),
            createAssetInfo(contractAddress, 'hey-token', 'hey-token')
          ),
        ],
        onCancel,
        network,
        stxAddress: address,
      });
    },
    [setIsLoading, onFinish, network, onCancel, address, doContractCall]
  );
}
