import React, { memo } from 'react';
import { Box, Flex } from '@stacks/ui';
import { AnimatePresence } from 'framer-motion';
import { Compose } from '@components/compose';
import { useFeed } from '@hooks/use-feed';
import { FeedItemComponent } from '@components/feed-item';
import { useCurrentAddress } from '@hooks/use-current-address';

const FeedList = memo(() => {
  const feed = useFeed();
  const address = useCurrentAddress();
  return (
    <AnimatePresence initial={false}>
      {feed.map((item, key) => {
        const isUser = item.sender === address;
        return (
          <FeedItemComponent
            isLast={key === feed.length - 1}
            key={item.id}
            item={item}
            isUser={isUser}
          />
        );
      })}
    </AnimatePresence>
  );
});

export const Feed = () => {
  return (
    <Box width="100%" mx="auto" mt="auto">
      <Flex
        flexDirection="column"
        flexGrow={1}
        spacing="extra-loose"
        position="relative"
        maxHeight="calc(100vh - 250px)"
        minHeight={0}
        overflowY="auto"
        overflowX="hidden"
        px="extra-loose"
        width="100%"
        mx="auto"
        maxWidth="600px"
      >
        <FeedList />
      </Flex>
      <Compose />
    </Box>
  );
};
