import { useAtomValue } from 'jotai/utils';
import { userHeyBalanceAtom } from '@store/hey';
import { useCurrentAddress } from '@hooks/use-current-address';

export function useHeyBalance() {
  const address = useCurrentAddress();
  return useAtomValue(userHeyBalanceAtom(address));
}
