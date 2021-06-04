import { useAtomValue } from 'jotai/utils';
import { namesByAddressAtom } from '@store/names';

export function useNamesByAddress(networkUrl: string, address: string) {
  return useAtomValue(namesByAddressAtom({ networkUrl, address }));
}
