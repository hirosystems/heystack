import { Client, Provider, ProviderRegistry } from '@blockstack/clarity';
import { ExampleTokenClient, TransferError } from '../src/example-token-client';

let traitClient: Client;
let provider: Provider;
let exampleTokenClient: ExampleTokenClient;

const alice = 'ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA';
const bob = 'ST1TWA18TSWGDAFZT377THRQQ451D1MSEM69C761';
const charlie = 'ST50GEWRE7W5B02G3J3K19GNDDAPC3XPZPYQRQDW';

describe('Fungible token trait', () => {
  beforeAll(async () => {
    provider = await ProviderRegistry.createProvider();
    traitClient = new Client(`${alice}.ft-trait`, 'clarinet/sip-10-ft-standard', provider);
    exampleTokenClient = new ExampleTokenClient(alice, provider);
  });

  test('The contracts are valid', async () => {
    await traitClient.checkContract();
    await traitClient.deployContract();

    await exampleTokenClient.checkContract();
    await exampleTokenClient.deployContract();
  });

  describe('Using the contracts', () => {
    test('Balances after minting are correct', async () => {
      expect(await exampleTokenClient.balanceOf(alice)).toEqual(100000000000000);
      expect(await exampleTokenClient.balanceOf(bob)).toEqual(100000000000000);
      expect(await exampleTokenClient.balanceOf(charlie)).toEqual(12345);
    });

    test('Transfering tokens', async () => {
      await exampleTokenClient.transfer(bob, 123, { sender: alice });

      expect(await exampleTokenClient.balanceOf(alice)).toEqual(99999999999877);
      expect(await exampleTokenClient.balanceOf(bob)).toEqual(100000000000123);

      await exampleTokenClient.transfer(charlie, 100, { sender: bob });

      expect(await exampleTokenClient.balanceOf(charlie)).toEqual(12445);

      expect(await exampleTokenClient.balanceOf(bob)).toEqual(100000000000023);
    });

    test('total supply', async () => {
      const totalSupply = await exampleTokenClient.totalSupply();
      expect(totalSupply).toEqual(200000000012345);

      const balances = await Promise.all([
        exampleTokenClient.balanceOf(alice),
        exampleTokenClient.balanceOf(bob),
        exampleTokenClient.balanceOf(charlie),
      ]);

      const total = balances.reduce((prev, next) => prev + next);
      expect(totalSupply).toEqual(total);
    });

    test('name', async () => {
      const name = await exampleTokenClient.getName();
      expect(name).toEqual('Example Token');
    });

    test('decimals', async () => {
      const decimals = await exampleTokenClient.decimals();
      expect(decimals).toEqual(8);
    });

    test('symbol', async () => {
      const symbol = await exampleTokenClient.symbol();
      expect(symbol).toEqual('EXAMPLE');
    });

    test('Cannot transfer more than your balance', async () => {
      const previousBalance = await exampleTokenClient.balanceOf(charlie);
      await expect(
        exampleTokenClient.transfer(bob, 10000000000, { sender: charlie })
      ).rejects.toThrowError(new TransferError(1));
      expect(await exampleTokenClient.balanceOf(charlie)).toEqual(previousBalance);
    });

    test('Cannot invoke transfer with "sender" different than tx-sender', async () => {
      await expect(
        exampleTokenClient.transfer(bob, 10000000000, {
          sender: charlie,
          senderArg: alice,
        })
      ).rejects.toThrowError(new TransferError(4));
    });
  });
});
