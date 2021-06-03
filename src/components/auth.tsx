import React, { memo, useCallback, useState } from 'react';
import { useAtom } from 'jotai';
import Avatar from 'boring-avatars';
import { Button, Box, BoxProps, ButtonGroup, color, Fade, Flex, Stack } from '@stacks/ui';
import { useConnect } from '@stacks/connect-react';
import { userAtom, userSessionAtom } from '@store/auth';
import { Link } from '@components/link';
import { useHover } from '@common/hooks/use-hover';
import { Caption, Text } from '@components/typography';
import { border } from '@common/utils';

const Dropdown: React.FC<BoxProps & { onSignOut?: () => void; show?: boolean }> = memo(
  ({ onSignOut, show }) => {
    return (
      <Fade in={show}>
        {styles => (
          <Flex top="100%" right={0} position="absolute" style={styles}>
            <Stack
              _hover={{ bg: color('bg-alt') }}
              justifyContent="center"
              border={border()}
              overflow="hidden"
              boxShadow="mid"
              minHeight="60px"
              minWidth="212px"
              bg={color('bg')}
              borderRadius="12px"
              p="base"
            >
              <Link
                _hover={{ textDecoration: 'none !important' }}
                display="inline-block"
                ml={2}
                textStyle="caption.medium"
                color="red"
                onClick={() => {
                  onSignOut?.();
                }}
              >
                Disconnect
              </Link>
            </Stack>
          </Flex>
        )}
      </Fade>
    );
  }
);

const Menu: React.FC = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isHovered, setIsHovered] = useState(false);
  const bind = useHover(setIsHovered);
  const [userSession] = useAtom(userSessionAtom);

  const handleRemoveHover = useCallback(() => setIsHovered(false), [setIsHovered]);

  const handleSignOut = () => {
    userSession.signUserOut();
    handleRemoveHover();
    void setUser(null);
  };
  // TODO: username is "" and HEY is hardcoded
  // TODO: Add icons
  return (
    <Stack
      minWidth="212px"
      pt="tight"
      _hover={{
        cursor: 'pointer',
      }}
      {...bind}
    >
      <Stack alignItems="center" flexGrow={1} spacing="loose" p="base" isInline>
        <Box as={Avatar} name={user?.username} variant="beam" size="40px" />
        <Stack>
          <Text>{user?.username}</Text>
          <Caption>100 HEY</Caption>
        </Stack>
      </Stack>
      <Dropdown onSignOut={handleSignOut} show={isHovered} />
    </Stack>
  );
};

export const Auth: React.FC = () => {
  const { doOpenAuth } = useConnect();
  const [user] = useAtom(userAtom);

  return user ? (
    <Menu />
  ) : (
    <Box>
      <ButtonGroup spacing={'base'} mt={'base-loose'}>
        <Button size="md" mode="primary" onClick={() => doOpenAuth()} data-test="connect-wallet">
          Connect wallet
        </Button>
      </ButtonGroup>
    </Box>
  );
};
