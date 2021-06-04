import React, { memo } from 'react';
import { Box, Fade, IconButton, Stack, StackProps } from '@stacks/ui';
import { Button } from '@components/button';
import { border } from '@common/utils';
import { Caption, Text, Title } from '@components/typography';
import { ConnectGraphic } from '@components/connect-graphic';
import { FiChevronDown, FiX } from 'react-icons/fi';
import { useUser } from '@hooks/use-user';
import { ConnectWalletButton } from '@components/connect-wallet-button';
import { useLoading } from '@hooks/use-loading';
import { LOADING_KEYS } from '@store/ui';
import { useHandleClaimHey } from '@hooks/use-claim-hey';
import { UserAvatar } from '@components/user-avatar';
import { useShowWelcome } from '@hooks/use-show-welcome';
import { ClaimHeyButton } from '@components/claim-hey-button';
import { useHeyBalance } from '@hooks/use-hey-balance';

const HiddenTitle = memo(() => {
  const { toggleIsShowing } = useShowWelcome();

  return (
    <Stack alignItems="center" isInline justifyContent="space-between">
      <Box />
      <IconButton
        onClick={toggleIsShowing}
        size="28px"
        iconSize="16px"
        bg="transparent"
        as={'button'}
        icon={FiChevronDown}
        border={0}
      />
    </Stack>
  );
});
const AboutSection = memo((props: StackProps) => {
  const { toggleIsShowing } = useShowWelcome();
  return (
    <Stack spacing="base" {...props}>
      <Stack alignItems="center" isInline justifyContent="space-between">
        <Box />
        <IconButton
          onClick={toggleIsShowing}
          size="28px"
          iconSize="16px"
          bg="transparent"
          as={'button'}
          icon={FiX}
          border={0}
        />
      </Stack>
      <Caption variant="c1">
        Heystack is a decentralized chat app built on Stacks. 💬 Spend HEY to chat and upvote, 💸
        receive HEY when your chats are upvoted.
      </Caption>
    </Stack>
  );
});

const SignedOutView: React.FC<StackProps> = ({ ...props }) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      spacing="loose"
      textAlign="center"
      {...props}
    >
      <Box width="110px">
        <ConnectGraphic />
      </Box>

      <Text maxWidth="24ch" fontWeight={500}>
        Connect your wallet to get 100 HEY and start chatting
      </Text>
      <ConnectWalletButton />
    </Stack>
  );
};
const SignedInView: React.FC<StackProps> = ({ ...props }) => {
  const balance = useHeyBalance();
  if (balance !== '0') return null;
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      spacing="loose"
      textAlign="center"
      {...props}
    >
      <UserAvatar size="64px" />
      <Text maxWidth="24ch" fontWeight={500}>
        Welcome to Heystack! Claim your 100 HEY to start chatting{' '}
      </Text>
      <ClaimHeyButton />
    </Stack>
  );
};

const UserSection = memo((props: StackProps) => {
  const { user } = useUser(); // something like this

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      spacing="loose"
      textAlign="center"
      {...props}
    >
      <React.Suspense fallback={<></>}>
        {!user ? <SignedOutView /> : <SignedInView />}
      </React.Suspense>
    </Stack>
  );
});

const LearnMoreSection = memo((props: StackProps) => {
  return (
    <Stack justifyContent="flex-start" alignItems="flex-start" spacing="loose" {...props}>
      <Caption>
        Learn how to build your own decentralized app on Stacks by building Heystack
      </Caption>
      <Button mode="tertiary">View tutorial</Button>
    </Stack>
  );
});
export const WelcomePanel = memo(props => {
  const { isShowing } = useShowWelcome();
  return (
    <>
      <Stack
        position="absolute"
        p="loose"
        maxWidth="336px"
        borderRadius="12px"
        spacing="extra-loose"
        width="100%"
      >
        <Title py="tight" variant="h3">
          About Heystack
        </Title>
      </Stack>
      <Fade in={isShowing}>
        {styles => (
          <Stack
            position="absolute"
            p="loose"
            maxWidth="336px"
            border={border()}
            borderRadius="12px"
            spacing="extra-loose"
            minHeight="calc(100vh - 64px)"
            style={styles}
          >
            <AboutSection />
            <UserSection />
            <LearnMoreSection />
          </Stack>
        )}
      </Fade>
      <Fade in={!isShowing}>
        {styles => (
          <Stack
            width="100%"
            position="absolute"
            p="loose"
            maxWidth="336px"
            spacing="extra-loose"
            minHeight="calc(100vh - 64px)"
            style={styles}
            border="1px solid transparent"
          >
            <HiddenTitle />
          </Stack>
        )}
      </Fade>
    </>
  );
});
