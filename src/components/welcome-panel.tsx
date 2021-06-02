import { memo, useState } from 'react';
import { Box, IconButton, Stack, StackProps } from '@stacks/ui';
import { Button } from '@components/button';
import { border } from '@common/utils';
import { Caption, Text, Title } from '@components/typography';
import { ConnectGraphic } from '@components/connect-graphic';
import { FiX } from 'react-icons/fi';
import Avatar from 'boring-avatars';

const AboutSection = memo((props: StackProps) => {
  return (
    <Stack spacing="tight" {...props}>
      <Stack alignItems="center" isInline justifyContent="space-between">
        <Title variant="h3">About Heystack</Title>
        <IconButton bg="transparent" as={'button'} icon={FiX} border={0} />
      </Stack>
      <Caption variant="c1">
        Heystack is a decentralized chat app built on Stacks. 💬 Spend HEY to chat and upvote, 💸
        receive HEY when your chats are upvoted.
      </Caption>
    </Stack>
  );
});

const SignedOutView: React.FC<StackProps> = ({ onClick, ...props }) => {
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
      <Button onClick={onClick}>Connect wallet</Button>
    </Stack>
  );
};
const SignedInView: React.FC<StackProps> = ({ onClick, ...props }) => {
  // const { user } = useUser();
  const name = 'asdadsd random'; // TODO: user.addresses.mainnet
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      spacing="loose"
      textAlign="center"
      {...props}
    >
      <Box as={Avatar} name={name} variant="beam" size="64px" />

      <Text maxWidth="24ch" fontWeight={500}>
        Welcome to Heystack! Claim your 100 HEY to start chatting{' '}
      </Text>
      <Button onClick={onClick}>Claim HEY</Button>
    </Stack>
  );
};

const UserSection = memo((props: StackProps) => {
  // TODO: auth
  // const {isLoading, isSignedIn, user} = useAuth(); // something like this
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      spacing="loose"
      textAlign="center"
      {...props}
    >
      {!isSignedIn ? (
        <SignedOutView onClick={() => setIsSignedIn(true)} />
      ) : (
        <SignedInView onClick={() => console.log('click')} />
      )}
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
  return (
    <Stack p="loose" maxWidth="336px" border={border()} borderRadius="12px" spacing="extra-loose">
      <AboutSection />
      <UserSection />
      <LearnMoreSection />
    </Stack>
  );
});
