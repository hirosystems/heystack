import { useUpdateAtom } from 'jotai/utils';
import { incrementAtom } from '@store/hey';
import { useCallback } from 'react';

export function useApiRevalidation() {
  const updateIncrement = useUpdateAtom(incrementAtom);
  return useCallback(() => updateIncrement(i => i + 1), [updateIncrement]);
}
