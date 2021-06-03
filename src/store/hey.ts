import { atom } from 'jotai';
import { userAtom } from '@store/auth';
import { accountsClientAtom, smartContractsClientAtom, transactionsClientAtom } from '@store/api';
import { HEY_TOKEN_ADDRESS } from '@common/constants';
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';
import { cvToHex, cvToString, hexToCV } from '@stacks/transactions';
import {
  ContractCallTransaction,
  MempoolTransactionListResponse,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';
import { atomWithQuery } from 'jotai/query';

export interface Heystack {
  sender: string;
  content: string;
  id: string;
}

export const incrementAtom = atom(0);

export const userHeyBalanceAtom = atom(async get => {
  get(incrementAtom);
  const user = get(userAtom);
  if (!user?.profile?.stxAddress?.testnet) return;
  const client = get(smartContractsClientAtom);
  const [contractAddress, contractName] = HEY_TOKEN_ADDRESS.split('.');
  const data = await client.callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-balance',
    readOnlyFunctionArgs: {
      sender: user?.profile?.stxAddress?.testnet || '',
      arguments: [cvToHex(principalCV(user?.profile?.stxAddress?.testnet || ''))],
    },
  });
  if (data.okay && data.result) {
    return cvToString(hexToCV(data.result)).replace('(ok u', '').replace(')', '');
  }
});

const defaultOptions = {
  refetchInterval: 1000,
  refetchOnReconnect: true,
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  keepPreviousData: true,
};
export const heyTransactionsAtom = atomWithQuery<ContractCallTransaction[], string>(get => ({
  queryKey: ['hey-txs'],
  ...(defaultOptions as any),
  queryFn: async (): Promise<ContractCallTransaction[]> => {
    const client = get(accountsClientAtom);
    const txs = await client.getAccountTransactions({
      principal: 'ST21FTC82CCKE0YH9SK5SJ1D4XEMRA069FKV0VJ8N.heystack',
    });
    return (txs as TransactionResults).results.filter(
      tx => tx.tx_type === 'contract_call'
    ) as ContractCallTransaction[];
  },
}));

export const pendingTxsAtom = atomWithQuery<Heystack[], string>(get => ({
  queryKey: ['hey-pending-txs'],
  ...(defaultOptions as any),
  queryFn: async (): Promise<Heystack[]> => {
    const client = get(transactionsClientAtom);

    const txs = await client.getMempoolTransactionList({});
    const heyTxs = (txs as MempoolTransactionListResponse).results
      .filter(
        tx =>
          tx.tx_type === 'contract_call' &&
          tx.contract_call.contract_id === 'ST21FTC82CCKE0YH9SK5SJ1D4XEMRA069FKV0VJ8N.heystack'
      )
      .map(tx => tx.tx_id);
    const final = await Promise.all(heyTxs.map(txid => client.getTransactionById({ txId: txid })));

    return (
      (final as ContractCallTransaction[]).map(tx => ({
        sender: tx.sender_address,
        content: tx.contract_call.function_args?.[0].repr.replace(`u"`, '').slice(0, -1) as string,
        id: tx.tx_id,
      })) || []
    );
  },
}));

export const contentTransactionsAtom = atom(get => {
  const txs = get(heyTransactionsAtom);
  const pending = get(pendingTxsAtom);
  const feed = txs.map(tx => {
    const content = tx.contract_call.function_args?.[0].repr.replace(`u"`, '').slice(0, -1);
    return {
      content,
      sender: tx.sender_address,
      id: tx.tx_id,
    };
  });
  return [...pending, ...feed].reverse() as Heystack[];
});
