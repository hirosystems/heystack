import { useUser } from '@hooks/use-user';

export function useCurrentAddress() {
  const { addresses } = useUser();
  return addresses?.testnet;
}

// Temporarily being used to get names from mainnet address
export function useCurrentMainnetAddress() {
  const { addresses } = useUser();
  return addresses?.mainnet;
}
