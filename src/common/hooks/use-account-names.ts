import { useAtomValue } from 'jotai/utils';
import { namesAtom } from '@store/names';

export function useAccountNames(address: string) {
  return useAtomValue(namesAtom(address));
}
