import React, { memo } from 'react';
import { Box, ColorModeProvider, Flex, ThemeProvider } from '@stacks/ui';
import { Header } from '@components/header';

export const App: React.FC = memo(() => {
  return (
    <ThemeProvider>
      <ColorModeProvider defaultMode="light">
        <Flex flexDirection="column" minHeight="100vh" minWidth="100%">
          <Header />
          <Flex flexGrow={1}>app</Flex>
        </Flex>
      </ColorModeProvider>
    </ThemeProvider>
  );
});

export default App;
