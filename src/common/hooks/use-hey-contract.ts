import { HEY_CONTRACT, HEY_TOKEN_ADDRESS } from '@common/constants';

export function useHeyContract(): [contractAddress: string, contractName: string] {
  return HEY_CONTRACT.split('.') as [contractAddress: string, contractName: string];
}

export function useHeyTokenContract() {
  return HEY_TOKEN_ADDRESS.split('.') as [contractAddress: string, contractName: string];
}
