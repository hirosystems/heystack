import React from 'react';
import { Box, color, Fade, Flex } from '@stacks/ui';
import { useAtomValue } from 'jotai/utils';
import { showPendingOverlayAtom } from '@store/ui';

export const PendingOverlay = () => {
  const isShowing = useAtomValue(showPendingOverlayAtom);
  return (
    <Fade in={isShowing}>
      {style => (
        <Flex
          width="100vw"
          height="100vh"
          position="fixed"
          bg="rgba(0,0,0,0.5)"
          style={style}
          zIndex={999}
          justifyContent="flex-end"
          alignItems="flex-end"
          p="extra-loose"
        >
          <Box bg={color('bg')} p="extra-loose" borderRadius="24px">
            Confirm the transaction in your wallet
          </Box>
        </Flex>
      )}
    </Fade>
  );
};
