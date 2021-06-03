import { useUser } from '@hooks/use-user';

export function useCurrentAddress() {
  const { addresses } = useUser();
  return addresses?.testnet;
}
