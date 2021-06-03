import { useUser } from '@hooks/use-user';
import { useLoading } from '@hooks/use-loading';
import { LOADING_KEYS, showPendingOverlayAtom } from '@store/ui';
import { useConnect } from '@stacks/connect-react';
import { useNetwork } from '@hooks/use-network';
import { useCallback } from 'react';
import { stringUtf8CV } from '@stacks/transactions';
import { useApiRevalidation } from '@hooks/use-api-revalidation';
import { useUpdateAtom } from 'jotai/utils';

export function useHandlePublishContent() {
  const revalidate = useApiRevalidation();
  const setShowPendingOverlay = useUpdateAtom(showPendingOverlayAtom);
  const { addresses } = useUser(); // something like this
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
        contractAddress: 'ST21FTC82CCKE0YH9SK5SJ1D4XEMRA069FKV0VJ8N',
        contractName: 'heystack',
        functionName: 'publish-content',
        functionArgs: [stringUtf8CV(content)],
        onFinish: () => {
          _onFinish();
          onFinish();
          void revalidate();
        },
        onCancel,
        network,
        stxAddress: addresses?.testnet,
      });
    },
    [setIsLoading, onFinish, network, onCancel, addresses, doContractCall]
  );
}
