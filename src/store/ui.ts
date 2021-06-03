import { atomFamily } from 'jotai/utils';
import { atom } from 'jotai';
import { StacksTestnet } from '@stacks/network';

export enum LOADING_KEYS {
  AUTH = 'loading/AUTH',
  CLAIM_HEY = 'loading/CLAIM_HEY',
  SEND_HEY = 'loading/SEND_HEY',
}

export const loadingAtom = atomFamily(key => atom(false));
export const networkAtom = atom(() => {
  const _network = new StacksTestnet();
  _network.coreApiUrl = 'https://stacks-node-api.regtest.stacks.co';
  return _network;
});
export const showPendingOverlayAtom = atom(false);
