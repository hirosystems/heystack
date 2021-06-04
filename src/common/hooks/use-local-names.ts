import { useAtomValue } from 'jotai/utils';
import { localNamesAtom } from '@store/names';

export function useLocalNames(key: string, data?: [string[], number]) {
  return useAtomValue(localNamesAtom({ key, data }));
}
