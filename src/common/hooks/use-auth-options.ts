import { useUserSession } from '@hooks/use-usersession';
import { useLoading } from '@hooks/use-loading';
import { LOADING_KEYS } from '@store/ui';
import { useUser } from '@hooks/use-user';
import { useCallback } from 'react';
import { FinishedData } from '@stacks/connect-react';
import { AuthOptions } from '@stacks/connect';

export function useAuthOptions() {
  const userSession = useUserSession();
  const { setIsLoading } = useLoading(LOADING_KEYS.AUTH);
  const { setUser } = useUser();

  const onFinish = useCallback(
    async ({ userSession }: FinishedData) => {
      const userData = userSession?.loadUserData?.();
      await setUser(userData);
      void setIsLoading(false);
    },
    [setUser]
  );
  const onCancel = useCallback(() => {
    void setIsLoading(false);
  }, [setIsLoading]);

  const authOptions: AuthOptions = {
    manifestPath: '/static/manifest.json',
    userSession,
    onFinish,
    onCancel,
    appDetails: {
      name: 'Heystack',
      icon: '/icon.png',
    },
  };
  return authOptions;
}
