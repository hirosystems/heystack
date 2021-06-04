import React, { memo, useRef } from 'react';
import Textarea from 'react-textarea-autosize';
import { Fade, Box, Stack, Grid, Flex, color, IconButton, Spinner, transition } from '@stacks/ui';
import { border } from '@common/utils';
import { Button } from '@components/button';
import { ConnectWalletButton } from '@components/connect-wallet-button';
import { ClaimHeyButton } from '@components/claim-hey-button';
import { useComposeField } from '@hooks/use-compose-field';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { gihpyResultsAtom } from '@store/giphy';
import { useToggle } from '@hooks/use-boolean';
import { FiX } from 'react-icons/fi';
import { Caption, Title } from '@components/typography';
import { attachmentUriAtom } from '@store/feed';

const GiphyGrid = memo(() => {
  const results = useAtomValue(gihpyResultsAtom);
  const setAttachment = useUpdateAtom(attachmentUriAtom);
  const { setToggle } = useToggle('GIF_RESULTS');
  return (
    <Grid
      gridGap="base"
      overflow="auto"
      maxHeight="600px"
      minHeight="600px"
      gridTemplateColumns={results?.length ? 'repeat(4, 1fr)' : '1fr'}
    >
      {results?.length ? (
        results?.map((item: any) => (
          <Box
            maxWidth="100%"
            as="img"
            _hover={{ cursor: 'pointer' }}
            onClick={() => {
              void setToggle(false);
              void setAttachment(item.images.downsized_medium.url);
            }}
            src={item.images.downsized.url}
          />
        ))
      ) : (
        <Flex
          minHeight="600px"
          width="100%"
          alignItems="center"
          flexGrow={1}
          textAlign="center"
          justifyContent="center"
        >
          <Caption>No results, try a different query</Caption>
        </Flex>
      )}
    </Grid>
  );
});
const GifResults = memo(() => {
  const { toggle, handleToggle } = useToggle('GIF_RESULTS');
  return (
    <Fade in={toggle}>
      {styles => (
        <Flex
          position="absolute"
          pb="loose"
          alignItems="center"
          mx="auto"
          width="600px"
          left={0}
          bottom="100%"
          style={styles}
        >
          <Stack
            border={border()}
            p="loose"
            alignItems="center"
            borderRadius="24px"
            mx="auto"
            width="600px"
            boxShadow="mid"
            spacing="base"
            bg={color('bg')}
          >
            <Stack width="100%" isInline justifyContent="space-between" alignItems="center">
              <Title variant="h3">Giphy search</Title>
              <IconButton icon={FiX} onClick={handleToggle} />
            </Stack>
            <React.Suspense
              fallback={
                <Flex minHeight="600px" width="100%" alignItems="center" justifyContent="center">
                  <Spinner borderStyle="solid" />
                </Flex>
              }
            >
              <GiphyGrid />
            </React.Suspense>
          </Stack>
        </Flex>
      )}
    </Fade>
  );
});

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
      onSubmit={onSubmit}
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
      <GifResults />
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
