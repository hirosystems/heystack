import { useAtom } from 'jotai';
import { userAtom } from '@store/auth';
import { UserData } from '@stacks/auth';

export function useUser() {
  const [user, setUser] = useAtom<UserData | undefined, UserData | undefined>(userAtom);
  return {
    user,
    profile: user?.profile,
    addresses: user?.profile?.stxAddress,
    setUser,
    isSignedIn: !!user,
  };
}
