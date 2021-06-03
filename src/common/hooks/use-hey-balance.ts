import { useAtomValue } from 'jotai/utils';
import { userHeyBalanceAtom } from '@store/hey';

export function useHeyBalance() {
  return useAtomValue(userHeyBalanceAtom);
}
