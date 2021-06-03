import { atom } from 'jotai';
import {
  AccountsApi,
  Configuration,
  SmartContractsApi,
  TransactionsApi,
} from '@stacks/blockchain-api-client';
import { networkAtom } from '@store/ui';

const configAtom = atom(get => {
  const network = get(networkAtom);
  return new Configuration({ basePath: network.coreApiUrl });
});

export const smartContractsClientAtom = atom(get => {
  const config = get(configAtom);
  return new SmartContractsApi(config);
});

export const accountsClientAtom = atom(get => {
  const config = get(configAtom);
  return new AccountsApi(config);
});
export const transactionsClientAtom = atom(get => {
  const config = get(configAtom);
  return new TransactionsApi(config);
});
