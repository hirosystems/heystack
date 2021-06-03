import React, { memo } from 'react';
import { Box, Flex, Stack, StackProps } from '@stacks/ui';
import { Logo } from '@components/logo';
import { Auth } from '@components/auth';

export const Header = memo((props: StackProps) => (
  <>
    <Stack top="extra-loose" position="fixed" width="100%" p="base" isInline {...props}>
      <Stack pointerEvents="none" isInline mx="auto">
        <Box fontSize="32px">🐴</Box>
        <Logo width="200px" maxWidth="200px" mx="auto" />
      </Stack>
    </Stack>
    <Auth />
  </>
));
