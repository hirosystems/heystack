import React, { memo, useCallback, useState } from 'react';
import { useAtom } from 'jotai';
import { FiChevronDown, FiLogOut } from 'react-icons/fi';
import { Box, BoxProps, color, Fade, Flex, Stack } from '@stacks/ui';
import { userAtom } from '@store/auth';
import { Link } from '@components/link';
import { useHover } from '@common/hooks/use-hover';
import { Caption, Text } from '@components/typography';
import { border } from '@common/utils';
import { useUser } from '@hooks/use-user';
import { truncateMiddle } from '@stacks/ui-utils';
import { useUserSession } from '@hooks/use-usersession';
import { ConnectWalletButton } from '@components/connect-wallet-button';
import { useHeyBalance } from '@hooks/use-hey-balance';
import { useCurrentAddress, useCurrentMainnetAddress } from '@hooks/use-current-address';
import { UserAvatar } from '@components/user-avatar';
import { useAccountNames } from '@common/hooks/use-account-names';

const Dropdown: React.FC<BoxProps & { onSignOut?: () => void; show?: boolean }> = memo(
  ({ onSignOut, show }) => {
    return (
      <Fade in={show}>
        {styles => (
          <Flex top="100%" right={0} position="absolute" zIndex={99999} style={styles}>
            <Stack
              onClick={() => {
                onSignOut?.();
              }}
              isInline
              _hover={{ bg: color('bg-alt') }}
              alignItems="center"
              border={border()}
              overflow="hidden"
              boxShadow="mid"
              minHeight="60px"
              minWidth="212px"
              bg={color('bg')}
              borderRadius="12px"
              p="base"
              position="relative"
              zIndex={9999999999}
            >
              <FiLogOut color="#D4001A" />
              <Link
                _hover={{ textDecoration: 'none !important' }}
                display="inline-block"
                mb={1}
                ml={2}
                textStyle="caption.medium"
                color="red"
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

const AccountNameComponent = memo(() => {
  const { user } = useUser();
  // Temporarily getting names from mainnet
  const address = useCurrentMainnetAddress();
  const testnetAddress = useCurrentAddress();
  const names = useAccountNames(address);
  const name = names?.[0];
  return <Text mb="tight">{name || user?.username || truncateMiddle(testnetAddress)}</Text>;
});

const BalanceComponent = memo(() => {
  const balance = useHeyBalance();
  return <Caption pr="tight">{balance || 0} HEY</Caption>;
});

const Menu: React.FC = memo(() => {
  const { setUser } = useUser();
  const userSession = useUserSession();
  const [isHovered, setIsHovered] = useState(false);
  const bind = useHover(setIsHovered);
  const handleRemoveHover = useCallback(() => setIsHovered(false), [setIsHovered]);
  const testnetAddress = useCurrentAddress();

  const handleSignOut = useCallback(() => {
    handleRemoveHover();
    userSession.signUserOut();
    void setUser(undefined);
  }, [userSession, setUser, handleRemoveHover]);

  return (
    <Stack
      minWidth="212px"
      _hover={{
        cursor: 'pointer',
      }}
      {...bind}
    >
      <Stack alignItems="center" flexGrow={1} spacing="loose" p="base" isInline>
        <UserAvatar />
        <Stack spacing="base-tight">
          <React.Suspense fallback={<Text mb="tight">{truncateMiddle(testnetAddress)}</Text>}>
            <AccountNameComponent />
          </React.Suspense>
          <Stack isInline alignItems="center">
            <React.Suspense fallback={<Caption pr="tight">-- HEY</Caption>}>
              <BalanceComponent />
            </React.Suspense>
            <FiChevronDown />
          </Stack>
        </Stack>
      </Stack>
      <Dropdown onSignOut={handleSignOut} show={isHovered} />
    </Stack>
  );
});

export const UserArea: React.FC = memo(() => {
  const [user] = useAtom(userAtom);

  return (
    <Box position="fixed" top="extra-loose" right="extra-loose" zIndex={9999}>
      {user ? <Menu /> : <ConnectWalletButton />}
    </Box>
  );
});
