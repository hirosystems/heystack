import { useAtomValue } from 'jotai/utils';
import { heyTransactionsAtom } from '@store/hey';

export function useHeyTransactions() {
  return useAtomValue(heyTransactionsAtom);
}
