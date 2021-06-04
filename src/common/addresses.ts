import { c32address, c32addressDecode, versions } from 'c32check';

type Networks = 'testnet' | 'mainnet';

type Versions =
  | typeof versions.testnet.p2pkh
  | typeof versions.testnet.p2sh
  | typeof versions.mainnet.p2pkh
  | typeof versions.mainnet.p2sh;

interface AddressDetails {
  version: Versions;
  network: Networks;
  type: 'p2pkh' | 'p2sh';
}

/**
 * Get address details
 *
 * Takes a C32 address and provides more verbose details about type and network
 */
export function getAddressDetails(address: string): AddressDetails {
  const [version] = c32addressDecode(address);

  if (version === versions.testnet.p2pkh) {
    return {
      version,
      network: 'testnet',
      type: 'p2pkh',
    };
  } else if (version === versions.testnet.p2sh) {
    return {
      version,
      network: 'testnet',
      type: 'p2sh',
    };
  } else if (version === versions.mainnet.p2pkh) {
    return {
      version,
      type: 'p2pkh',
      network: 'mainnet',
    };
  } else if (version === versions.mainnet.p2sh) {
    return {
      version,
      type: 'p2sh',
      network: 'mainnet',
    };
  } else {
    throw new Error(`Unexpected address version: ${version}`);
  }
}

/**
 * Invert address
 *
 * Automatically invert address between testnet/mainnet
 */
export const invertAddress = (address: string): string => {
  const [version, hash160] = c32addressDecode(address);
  let _version = 0;
  if (version === versions.mainnet.p2pkh) {
    _version = versions.testnet.p2pkh;
  } else if (version === versions.mainnet.p2sh) {
    _version = versions.testnet.p2sh;
  } else if (version === versions.testnet.p2pkh) {
    _version = versions.mainnet.p2pkh;
  } else if (version === versions.testnet.p2sh) {
    _version = versions.mainnet.p2sh;
  } else {
    throw new Error(`Unexpected address version: ${version}`);
  }
  return c32address(_version, hash160);
};

/**
 * Convert address
 *
 * Converts a STACKS address to a given network mode (testnet/mainnet)
 */

export function convertAddress(address: string, network: 'testnet' | 'mainnet'): string {
  const details = getAddressDetails(address);
  if (details.network !== network) {
    return invertAddress(address);
  }
  return address;
}
