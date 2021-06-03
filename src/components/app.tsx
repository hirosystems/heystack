import React, { memo } from 'react';
import { color, ColorModeProvider, Flex, Spinner, ThemeProvider } from '@stacks/ui';
import { Connect } from '@stacks/connect-react';
import { Header } from '@components/header';
import { WelcomePanel } from '@components/welcome-panel';
import { Feed } from '@components/feed';
import { useAuthOptions } from '@hooks/use-auth-options';
import 'modern-normalize/modern-normalize.css';

const AppWrapper: React.FC = memo(({ children }) => {
  const authOptions = useAuthOptions();
  return (
    <ThemeProvider>
      <ColorModeProvider defaultMode="light">
        <Connect authOptions={authOptions}>{children}</Connect>
      </ColorModeProvider>
    </ThemeProvider>
  );
});

export const App: React.FC = memo(() => {
  return (
    <AppWrapper>
      <Flex bg={color('bg-4')} flexDirection="column" minHeight="100vh" minWidth="100%" p="base">
        <Flex bg={color('bg')} flexDirection="column" flexGrow={1} borderRadius="24px">
          <Header />
          <Flex p="base" flexGrow={1}>
            <WelcomePanel />
            <React.Suspense
              fallback={
                <Flex
                  transform="translateX(-150px)"
                  alignItems="center"
                  justifyContent="center"
                  width="600px"
                  flexGrow={1}
                >
                  <Spinner size="96px" borderStyle="solid" />
                </Flex>
              }
            >
              <Feed />
            </React.Suspense>
          </Flex>
        </Flex>
      </Flex>
    </AppWrapper>
  );
});

export default App;
