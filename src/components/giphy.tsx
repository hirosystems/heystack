import React, { memo } from 'react';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { gihpyResultsAtom } from '@store/giphy';
import { attachmentUriAtom } from '@store/feed';
import { useToggle } from '@hooks/use-boolean';
import { Box, color, Fade, Flex, Grid, IconButton, Spinner, Stack } from '@stacks/ui';
import { Caption, Title } from '@components/typography';
import { border } from '@common/utils';
import { FiX } from 'react-icons/fi';

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

export const GiphyResultsCard = memo(() => {
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
