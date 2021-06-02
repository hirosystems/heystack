import React, { memo } from 'react';
import { Box, color, ColorModeProvider, Flex, ThemeProvider } from '@stacks/ui';
import { Header } from '@components/header';
import { WelcomePanel } from '@components/welcome-panel';
import 'modern-normalize/modern-normalize.css';

export const App: React.FC = memo(() => {
  return (
    <ThemeProvider>
      <ColorModeProvider defaultMode="light">
        <Flex bg={color('bg-4')} flexDirection="column" minHeight="100vh" minWidth="100%" p="base">
          <Flex bg={color('bg')} flexDirection="column" flexGrow={1} borderRadius="24px">
            <Header />
            <Flex p="base" flexGrow={1}>
              <WelcomePanel />
            </Flex>
          </Flex>
        </Flex>
      </ColorModeProvider>
    </ThemeProvider>
  );
});

export default App;
