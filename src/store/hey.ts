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

export const incrementAtom = atom(0);

export const userHeyBalanceAtom = atom(async get => {
  get(incrementAtom);
  const user = get(userAtom);
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

export const heyTransactionsAtom = atom(async get => {
  get(incrementAtom);
  const client = get(accountsClientAtom);
  const txs = await client.getAccountTransactions({
    principal: 'ST21FTC82CCKE0YH9SK5SJ1D4XEMRA069FKV0VJ8N.heystack',
  });
  return (txs as TransactionResults).results.filter(
    tx => tx.tx_type === 'contract_call'
  ) as ContractCallTransaction[];
});

const pendingTxsAtom = atom(async get => {
  get(incrementAtom);
  const client = get(transactionsClientAtom);

  const txs = await client.getMempoolTransactionList({});
  const heyTxs = (txs as MempoolTransactionListResponse).results
    .filter(
      tx =>
        tx.tx_type === 'contract_call' &&
        tx.contract_call.contract_id === 'ST21FTC82CCKE0YH9SK5SJ1D4XEMRA069FKV0VJ8N.heystack'
    )
    .map(tx => tx.tx_id);
  const final = await Promise.all(
    heyTxs.map(async txid => client.getTransactionById({ txId: txid }))
  );

  return (
    (final as ContractCallTransaction[]).map(tx => ({
      sender: tx.sender_address,
      content: tx.contract_call.function_args?.[0].repr,
    })) || []
  );
});
export const contentTransactionsAtom = atom(get => {
  get(incrementAtom);
  const txs = get(heyTransactionsAtom);
  const pending = get(pendingTxsAtom);
  const feed = txs.map(tx => {
    const content = tx.contract_call.function_args?.[0].repr;
    return {
      content,
      sender: tx.sender_address,
    };
  });
  return [...pending, ...feed];
});
