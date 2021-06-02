import React, { memo, useEffect } from 'react';
import { useAtom } from 'jotai';
import { color, ColorModeProvider, Flex, ThemeProvider } from '@stacks/ui';
import { Connect } from '@stacks/connect-react';
import { AuthOptions } from '@stacks/connect';
import { appPrivateKeyAtom, authResponseAtom, userAtom, userSession } from '@store/auth';
import { Header } from '@components/header';
import { WelcomePanel } from '@components/welcome-panel';
import 'modern-normalize/modern-normalize.css';
import { Feed } from '@components/feed';
import { useUpdateAtom } from 'jotai/utils';

export const App: React.FC = memo(() => {
  const setAppPrivateKey = useUpdateAtom(appPrivateKeyAtom);
  const setAuthResponse = useUpdateAtom(authResponseAtom);
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      void setUser(user);
    }
  }, []);

  const authOptions: AuthOptions = {
    manifestPath: '/static/manifest.json',
    redirectTo: '/',
    userSession,
    onFinish: async ({ userSession, authResponse }) => {
      const user = userSession.loadUserData();
      await setAppPrivateKey(userSession.loadUserData().appPrivateKey);
      await setAuthResponse(authResponse);
      await setUser(user);
    },
    onCancel: () => {
      console.log('popup closed!');
    },
    appDetails: {
      name: 'Heystack',
      icon: '/public/assets/Stacks128w.png', // TODO: Fix
    },
  };

  return (
    <ThemeProvider>
      <ColorModeProvider defaultMode="light">
        <Connect authOptions={authOptions}>
          <Flex
            bg={color('bg-4')}
            flexDirection="column"
            minHeight="100vh"
            minWidth="100%"
            p="base"
          >
            <Flex bg={color('bg')} flexDirection="column" flexGrow={1} borderRadius="24px">
              <Header />
              <Flex p="base" flexGrow={1}>
                <WelcomePanel />
                <Feed />
              </Flex>
            </Flex>
          </Flex>
        </Connect>
      </ColorModeProvider>
    </ThemeProvider>
  );
});

export default App;
