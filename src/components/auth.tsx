import React, { memo, useCallback, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import Avatar from 'boring-avatars';
import { Box, BoxProps, color, Fade, Flex, Stack } from '@stacks/ui';
import { Button } from '@components/button';
import { useConnect } from '@stacks/connect-react';
import { userAtom } from '@store/auth';
import { Link } from '@components/link';
import { useHover } from '@common/hooks/use-hover';
import { Caption, Text } from '@components/typography';
import { border } from '@common/utils';
import { useUser } from '@hooks/use-user';
import { truncateMiddle } from '@stacks/ui-utils';
import { useUserSession } from '@hooks/use-usersession';
import { useLoading } from '@hooks/use-loading';
import { LOADING_KEYS } from '@store/ui';
import { ConnectWalletButton } from '@components/connect-wallet-button';
import { useHeyBalance } from '@hooks/use-hey-balance';

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
const BalanceComponent = memo(() => {
  const balance = useHeyBalance();
  return <Caption>{balance || 0} HEY</Caption>;
});

const Menu: React.FC = memo(() => {
  const { user, addresses, setUser } = useUser();
  const userSession = useUserSession();
  const [isHovered, setIsHovered] = useState(false);
  const bind = useHover(setIsHovered);
  const handleRemoveHover = useCallback(() => setIsHovered(false), [setIsHovered]);

  const handleSignOut = useCallback(() => {
    handleRemoveHover();
    userSession.signUserOut();
    void setUser(undefined);
  }, [userSession, setUser, handleRemoveHover]);

  // TODO: Add icons
  return (
    <Stack
      minWidth="212px"
      _hover={{
        cursor: 'pointer',
      }}
      {...bind}
    >
      <Stack alignItems="center" flexGrow={1} spacing="loose" p="base" isInline>
        <Box as={Avatar} name={addresses?.mainnet} variant="beam" size="40px" />
        <Stack spacing="base-tight">
          <Text>{user?.username || truncateMiddle(addresses?.mainnet)}</Text>

          <React.Suspense fallback={<></>}>
            <BalanceComponent />
          </React.Suspense>
        </Stack>
      </Stack>
      <Dropdown onSignOut={handleSignOut} show={isHovered} />
    </Stack>
  );
});

export const Auth: React.FC = memo(() => {
  const [user] = useAtom(userAtom);

  return user ? (
    <Menu />
  ) : (
    <Box p="loose">
      <ConnectWalletButton />
    </Box>
  );
});
