import { useHeyBalance } from '@hooks/use-hey-balance';
import { useUser } from '@hooks/use-user';
import { useCompose } from '@hooks/use-compose';
import { useHandlePublishContent } from '@hooks/use-publish-hey';
import { useLoading } from '@hooks/use-loading';
import { LOADING_KEYS } from '@store/ui';
import { useCallback } from 'react';
import { useToggle } from '@hooks/use-boolean';

export const useComposeField = () => {
  const balance = useHeyBalance();
  const { isSignedIn } = useUser();
  const { value, handleUpdate, handleReset } = useCompose();
  const handlePublishContent = useHandlePublishContent();
  const { isLoading } = useLoading(LOADING_KEYS.SEND_HEY);
  const handleSubmit = useCallback(() => {
    handlePublishContent(value, () => {
      void handleReset();
    });
  }, [handlePublishContent, value, handleReset]);

  const hasNoBalance = balance === '0' || !balance;

  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      if (!isSignedIn) {
        return;
      }
      handleSubmit();
    },
    [handleSubmit, isSignedIn]
  );

  return {
    onSubmit,
    onChange: handleUpdate,
    value,
    isSignedIn,
    isLoading,
    hasNoBalance,
  };
};
