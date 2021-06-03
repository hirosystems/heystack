import { useAtomValue } from 'jotai/utils';
import { networkAtom } from '@store/ui';

export function useNetwork() {
  return useAtomValue(networkAtom);
}
