import React, { memo, useRef } from 'react';
import Textarea from 'react-textarea-autosize';
import { Fade, Box, Stack, Flex, color, transition } from '@stacks/ui';
import { border } from '@common/utils';
import { Button } from '@components/button';
import { ConnectWalletButton } from '@components/connect-wallet-button';
import { ClaimHeyButton } from '@components/claim-hey-button';
import { useComposeField } from '@hooks/use-compose-field';
import { useToggle } from '@hooks/use-boolean';
import { GiphyResultsCard } from '@components/giphy';

const ComposeField = memo(() => {
  const { onChange, value, onSubmit, isSignedIn, isLoading, hasNoBalance } = useComposeField();
  const { toggle, handleToggle } = useToggle('GIF_RESULTS');
  const ref = useRef<HTMLInputElement | null>(null);
  return (
    <Stack
      isInline
      border={border()}
      p="loose"
      alignItems="center"
      borderRadius="24px"
      as="form"
      onSubmit={e => {
        e?.preventDefault();
        onSubmit();
      }}
      mx="auto"
      position="relative"
      width="600px"
    >
      <Box
        ref={ref as any}
        onChange={onChange}
        value={value}
        as={Textarea}
        resize="none"
        border={0}
        outline={0}
        placeholder={toggle ? 'Search GIPHY' : 'Say hey to other Stackers'}
        width="100%"
        pr="70px"
        onKeyPress={(event: React.KeyboardEvent) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit();
          }
        }}
      />
      <Flex position="absolute" right="loose">
        <Fade in={!toggle && value !== ''}>
          {styles =>
            isSignedIn ? (
              hasNoBalance ? (
                <ClaimHeyButton style={styles}>Claim hey</ClaimHeyButton>
              ) : (
                <Button isLoading={isLoading} style={styles}>
                  Send
                </Button>
              )
            ) : (
              <ConnectWalletButton style={styles} />
            )
          }
        </Fade>
        <Flex
          alignItems="center"
          ml={value !== '' ? 'base' : 'unset'}
          border={border()}
          py="tight"
          px="base"
          color={color('text-caption')}
          borderRadius="10px"
          onClick={() => {
            void handleToggle();
            if (!toggle) {
              setTimeout(() => {
                ref.current?.focus();
                ref.current?.select();
              }, 100);
            }
          }}
          transition={transition}
          _hover={{ cursor: 'pointer' }}
        >
          {toggle ? 'HIDE' : 'GIF'}
        </Flex>
      </Flex>
      <GiphyResultsCard />
    </Stack>
  );
});

const ComposeLoading = memo(() => (
  <Stack
    isInline
    border={border()}
    p="loose"
    alignItems="center"
    borderRadius="24px"
    mx="auto"
    position="relative"
    width="600px"
    pointerEvents="none"
  >
    <Box
      as={Textarea}
      resize="none"
      border={0}
      outline={0}
      placeholder="Say hey to other Stackers"
      width="100%"
      pr="70px"
    />
  </Stack>
));
export const Compose = memo(() => (
  <React.Suspense fallback={<ComposeLoading />}>
    <ComposeField />
  </React.Suspense>
));
