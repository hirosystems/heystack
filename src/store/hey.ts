import { atom } from 'jotai';
import { userAtom } from '@store/auth';
import { accountsClientAtom, smartContractsClientAtom, transactionsClientAtom } from '@store/api';
import { HEY_CONTRACT, HEY_TOKEN_ADDRESS, MESSAGE_FUNCTION } from '@common/constants';
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';
import { cvToHex, cvToJSON, cvToString, hexToCV, uintCV } from '@stacks/transactions';
import {
  ContractCallTransaction,
  MempoolTransactionListResponse,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';
import { atomWithQuery } from 'jotai/query';
import { atomFamily } from 'jotai/utils';

export interface Heystack {
  sender: string;
  content: string;
  attachment?: string;
  id: string;
  timestamp: number;
  isPending?: boolean;
  index?: number;
}

export const incrementAtom = atom(0);

export const userHeyBalanceAtom = atomFamily((address: string) =>
  atomWithQuery<string, string>(get => ({
    queryKey: ['balance', address],
    refetchInterval: 5000,
    ...(defaultOptions as any),
    queryFn: async (): Promise<string | undefined> => {
      if (!address) return;
      const client = get(smartContractsClientAtom);
      const [contractAddress, contractName] = HEY_TOKEN_ADDRESS.split('.');
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-balance',
        readOnlyFunctionArgs: {
          sender: address,
          arguments: [cvToHex(principalCV(address || ''))],
        },
      });
      if (data.okay && data.result) {
        return cvToString(hexToCV(data.result)).replace('(ok u', '').replace(')', '');
      }
    },
  }))
);

const defaultOptions = {
  refetchOnReconnect: true,
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  keepPreviousData: true,
};
export const heyTransactionsAtom = atomWithQuery<ContractCallTransaction[], string>(get => ({
  queryKey: ['hey-txs'],
  ...(defaultOptions as any),
  refetchInterval: 500,
  queryFn: async (): Promise<ContractCallTransaction[]> => {
    const client = get(accountsClientAtom);
    const txClient = get(transactionsClientAtom);

    const txs = await client.getAccountTransactions({
      principal: HEY_CONTRACT,
    });
    const txids = (txs as TransactionResults).results
      .filter(
        tx =>
          tx.tx_type === 'contract_call' &&
          tx.contract_call.function_name === MESSAGE_FUNCTION &&
          tx.tx_status === 'success'
      )
      .map(tx => tx.tx_id);

    const final = await Promise.all(txids.map(async txId => txClient.getTransactionById({ txId })));
    return final as ContractCallTransaction[];
  },
}));

export const pendingTxsAtom = atomWithQuery<Heystack[], string>(get => ({
  queryKey: ['hey-pending-txs'],
  refetchInterval: 1000,
  ...(defaultOptions as any),
  queryFn: async (): Promise<Heystack[]> => {
    const client = get(transactionsClientAtom);

    const txs = await client.getMempoolTransactionList({});
    const heyTxs = (txs as MempoolTransactionListResponse).results
      .filter(
        tx =>
          tx.tx_type === 'contract_call' &&
          tx.contract_call.contract_id === HEY_CONTRACT &&
          tx.contract_call.function_name === MESSAGE_FUNCTION &&
          tx.tx_status === 'pending'
      )
      .map(tx => tx.tx_id);

    const final = await Promise.all(heyTxs.map(async txId => client.getTransactionById({ txId })));

    return (
      (final as ContractCallTransaction[]).map(tx => {
        const attachment = tx.contract_call.function_args?.[1].repr
          .replace(`(some u"`, '')
          .slice(0, -1);

        return {
          sender: tx.sender_address,
          content: tx.contract_call.function_args?.[0].repr
            .replace(`u"`, '')
            .slice(0, -1) as string,
          id: tx.tx_id,
          attachment: attachment === 'non' ? undefined : attachment,
          timestamp: (tx as any).receipt_time,
          isPending: true,
        };
      }) || []
    );
  },
}));

export const contentTransactionsAtom = atom(get => {
  const txs = get(heyTransactionsAtom);
  const pending = get(pendingTxsAtom);
  const feed = txs.map(tx => {
    const content = tx.contract_call.function_args?.[0].repr.replace(`u"`, '').slice(0, -1);
    const attachment = tx.contract_call.function_args?.[1].repr
      .replace(`(some u"`, '')
      .slice(0, -1);
    const contractLog = tx.events?.[0]
      ? (tx.events?.[0] as any)?.event_type === 'smart_contract_log' &&
        (tx.events?.[0] as any).contract_log
        ? cvToJSON(hexToCV((tx.events?.[0] as any)?.contract_log?.value?.hex))
        : null
      : null;

    return {
      content,
      attachment,
      sender: tx.sender_address,
      id: tx.tx_id,
      index: contractLog?.value?.index?.value,
      timestamp: tx.burn_block_time,
    };
  });
  const combined = [...pending, ...feed];
  return combined
    .filter(item => combined.find(_item => item.id === _item.id))
    .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1)) as Heystack[];
});

export const itemLikesAtom = atomFamily((index: number) =>
  atomWithQuery<number, string>(get => ({
    queryKey: ['likes', index],
    refetchInterval: 1000,
    ...(defaultOptions as any),
    queryFn: async (): Promise<number> => {
      const client = get(smartContractsClientAtom);
      const [contractAddress, contractName] = HEY_CONTRACT.split('.');
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-like-count',
        readOnlyFunctionArgs: {
          sender: contractAddress,
          arguments: [cvToHex(uintCV(index))],
        },
      });
      if (data.okay && data.result) {
        const result = cvToJSON(hexToCV(data.result));
        return result.value.value.likes.value;
      }
      return 0;
    },
  }))
);
