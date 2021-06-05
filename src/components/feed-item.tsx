import { Heystack } from '@store/hey';
import { convertAddress } from '@common/addresses';
import { useAtomValue } from 'jotai/utils';
import { namesAtom } from '@store/names';
import { Caption, Text } from '@components/typography';
import { truncateMiddle } from '@stacks/ui-utils';
import React, { memo } from 'react';
import { Box, color, Flex, Stack } from '@stacks/ui';
import { border } from '@common/utils';
import { useGetItemLikes } from '@hooks/use-get-item-likes';
import { useHandleLikeHey } from '@hooks/use-like-hey';
import { useUser } from '@hooks/use-user';
import { toRelativeTime } from '@common/time';
import { FiArrowUpCircle } from 'react-icons/all';
import { motion } from 'framer-motion';
import { Avatar } from '@components/avatar';

const Address = ({ item }: { item: Heystack }) => {
  const address = convertAddress(item.sender, 'mainnet');
  const names = useAtomValue(namesAtom(address));
  return <Caption>{names?.[0] || truncateMiddle(item.sender)}</Caption>;
};

const Message = memo(({ isUser, item }: { isUser: boolean; item: Heystack }) => {
  return (
    <Stack
      border={border(isUser ? 'bg-4' : undefined)}
      bg={isUser ? color('bg-4') : color('bg')}
      borderRadius="24px"
      p="loose"
      isInline
    >
      <Stack alignItems={isUser ? 'flex-end' : 'unset'} spacing="base">
        {!isUser && (
          <Box>
            <React.Suspense fallback={<Caption>{truncateMiddle(item.sender)}</Caption>}>
              <Address item={item} />
            </React.Suspense>
          </Box>
        )}
        <Text>{item.content}</Text>
        {item.attachment ? (
          <Box maxWidth="100%" borderRadius="10px" as="img" src={item.attachment} />
        ) : null}
      </Stack>
    </Stack>
  );
});

const ItemLikes = ({ index }: { index: number }) => {
  const likes = useGetItemLikes(index);
  return <Caption color="currentColor">{likes}</Caption>;
};
const ItemDetailsRow = memo(({ isUser, item }: { isUser: boolean; item: Heystack }) => {
  const handleLikeHey = useHandleLikeHey();
  const { isSignedIn } = useUser();

  return (
    <Box pl={isUser ? 0 : 'loose'} pr={isUser ? 'loose' : 0}>
      <Stack isInline pl={isUser ? 0 : '36px'} pr={!isUser ? 0 : '36px'}>
        {item.isPending && <Caption color={color('feedback-alert')}>Pending</Caption>}
        <Caption>{toRelativeTime(item.timestamp * 1000)}</Caption>
        {item.index ? (
          <Stack
            onClick={!isSignedIn || isUser ? undefined : () => handleLikeHey(item.index as number)}
            alignItems="center"
            _hover={
              !isSignedIn || isUser ? undefined : { cursor: 'pointer', color: color('brand') }
            }
            isInline
            color={color('text-caption')}
          >
            <Box as={FiArrowUpCircle} size="14px" color="currentColor" />
            {!item.isPending && item.index && (
              <React.Suspense fallback={<Caption color="currentColor">...</Caption>}>
                <ItemLikes index={item.index} />
              </React.Suspense>
            )}
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
});

export const FeedItemComponent = memo(
  ({ isUser, item, ...rest }: { isUser: boolean; item: Heystack }) => {
    return (
      <Stack
        as={motion.div}
        layout="position"
        alignItems={isUser ? 'flex-end' : 'unset'}
        alignSelf={isUser ? 'flex-end' : 'unset'}
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        wordBreak="break-word"
        key={item.id}
        mb="loose"
        {...rest}
      >
        <Flex alignItems="flex-end">
          <Avatar
            flexShrink={0}
            order={isUser ? 2 : 0}
            name={item.sender}
            size="36px"
            mr={!isUser ? 'base' : 'unset'}
            ml={isUser ? 'base' : 'unset'}
          />
          <Message isUser={isUser} item={item} />
        </Flex>
        <ItemDetailsRow isUser={isUser} item={item} />
      </Stack>
    );
  }
);
