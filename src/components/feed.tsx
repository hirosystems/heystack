import React, { useState } from 'react';
import { Box, color, Flex, Stack, StackProps } from '@stacks/ui';
import Avatar from 'boring-avatars';
import { border } from '@common/utils';
import { Caption, Text } from '@components/typography';
import { FiArrowUpCircle } from 'react-icons/all';
import { motion, AnimatePresence } from 'framer-motion';
import { Compose } from '@components/compose';
import { FeedItem } from '@common/feed';
import { useFeed } from '@hooks/use-feed';

const Message = ({ isUser, item }: { isUser: boolean; item: FeedItem }) => {
  return (
    <Stack
      border={border(isUser ? 'bg-4' : undefined)}
      bg={isUser ? color('bg-4') : color('bg')}
      borderRadius="24px"
      p="loose"
      isInline
    >
      <Stack alignItems={isUser ? 'flex-end' : 'unset'} spacing="base">
        {!isUser && <Caption>{item.user.name || item.user.address}</Caption>}
        <Text>{item.heystack.content}</Text>
      </Stack>
    </Stack>
  );
};

const ItemDetailsRow = ({ isUser, item }: { isUser: boolean; item: FeedItem }) => {
  return (
    <Stack isInline pl={isUser ? 0 : '36px'} pr={!isUser ? 0 : '36px'}>
      <Stack alignItems="center" isInline pl={isUser ? 0 : 'loose'} pr={isUser ? 'loose' : 0}>
        <Box as={FiArrowUpCircle} size="14px" color={color('text-caption')} />
        <Caption>{item.heystack.upvotes}</Caption>
      </Stack>
    </Stack>
  );
};

const FeedItemComponent = ({
  isUser,
  item,
  index,
  ...rest
}: {
  index: number;
  isUser: boolean;
  item: FeedItem;
}) => {
  return (
    <Stack
      as={motion.div}
      layout="position"
      alignItems={isUser ? 'flex-end' : 'unset'}
      alignSelf={isUser ? 'flex-end' : 'unset'}
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      {...rest}
    >
      <Flex alignItems="flex-end">
        <Box
          flexShrink={0}
          order={isUser ? 2 : 0}
          as={Avatar}
          name={`${item.user.name || ''}__${item.user.address}`}
          variant="beam"
          size="36px"
          mr={!isUser ? 'base' : 'unset'}
          ml={isUser ? 'base' : 'unset'}
        />
        <Message isUser={isUser} item={item} />
      </Flex>
      <ItemDetailsRow isUser={isUser} item={item} />
    </Stack>
  );
};
export const Feed = (props: StackProps) => {
  const { feed } = useFeed();
  const user = 'j.btc';
  return (
    <Stack
      px="base"
      transform="translateX(-150px)"
      mx="auto"
      maxWidth="600px"
      alignSelf="flex-end"
      alignItems="flex-start"
      justifyContent="flex-end"
      flexGrow={1}
      spacing="extra-loose"
    >
      <Box>
        <AnimatePresence initial={false}>
          <Stack spacing="loose">
            {feed.map((item, key) => {
              const isUser = item.user.name === user;
              return <FeedItemComponent index={key} key={key} item={item} isUser={isUser} />;
            })}
          </Stack>
        </AnimatePresence>
      </Box>
      <Compose />
    </Stack>
  );
};