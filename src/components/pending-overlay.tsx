import React from 'react';
import { color, Fade, Flex, Spinner, Slide, Stack, Box } from '@stacks/ui';
import { showPendingOverlayAtom } from '@store/ui';
import { Caption } from '@components/typography';
import { useAtom } from 'jotai';

export const PendingOverlay = () => {
  const [isShowing, setIsShowing] = useAtom(showPendingOverlayAtom);
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
          _hover={{ cursor: 'pointer' }}
          onClick={() => setIsShowing(false)}
        >
          <Slide in={isShowing} placement="bottom">
            {slideStyles => (
              <Flex
                pb="extra-loose"
                pr="extra-loose"
                alignItems="flex-end"
                justifyContent="flex-end"
                position="fixed"
                bottom="extra-loose"
                right="extra-loose"
                style={slideStyles}
              >
                <Stack
                  ml="auto"
                  isInline
                  bg={color('bg')}
                  p="extra-loose"
                  borderRadius="24px"
                  alignItems="center"
                  spacing="base"
                >
                  <Caption>Confirm the transaction in your wallet</Caption>
                  <Spinner
                    opacity={0.5}
                    borderStyle="solid"
                    color={color('text-caption')}
                    size="sm"
                  />
                </Stack>
              </Flex>
            )}
          </Slide>
        </Flex>
      )}
    </Fade>
  );
};
