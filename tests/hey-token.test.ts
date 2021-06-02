import { Client, Provider, ProviderRegistry } from '@blockstack/clarity';
import { HeyTokenClient, TransferError } from '../src/hey-token-client';

let traitClient: Client;
let provider: Provider;
let heyClient: HeyTokenClient;

const alice = 'ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA';
const bob = 'ST1TWA18TSWGDAFZT377THRQQ451D1MSEM69C761';
const charlie = 'ST50GEWRE7W5B02G3J3K19GNDDAPC3XPZPYQRQDW';

describe('Hey token', () => {
  beforeAll(async () => {
    provider = await ProviderRegistry.createProvider();
    traitClient = new Client(`${alice}.ft-trait`, 'clarinet/sip-10-ft-standard', provider);
    heyClient = new HeyTokenClient(alice, provider);
  });

  test('The contracts are valid', async () => {
    await traitClient.checkContract();
    await traitClient.deployContract();

    await heyClient.checkContract();
    await heyClient.deployContract();
  });

  describe('Using the contracts', () => {
    // We don't set any initial balances
    test('Balances after minting are correct', async () => {
      expect(await heyClient.balanceOf(alice)).toEqual(0);
      expect(await heyClient.balanceOf(bob)).toEqual(0);
      expect(await heyClient.balanceOf(charlie)).toEqual(0);
    });

    // test('Transfering tokens', async () => {
    //   await heyClient.transfer(bob, 123, { sender: alice });

    //   expect(await heyClient.balanceOf(alice)).toEqual(99999999999877);
    //   expect(await heyClient.balanceOf(bob)).toEqual(100000000000123);

    //   await heyClient.transfer(charlie, 100, { sender: bob });

    //   expect(await heyClient.balanceOf(charlie)).toEqual(12445);

    //   expect(await heyClient.balanceOf(bob)).toEqual(100000000000023);
    // });

    test('total supply', async () => {
      const totalSupply = await heyClient.totalSupply();
      expect(totalSupply).toEqual(0);

      const balances = await Promise.all([
        heyClient.balanceOf(alice),
        heyClient.balanceOf(bob),
        heyClient.balanceOf(charlie),
      ]);

      const total = balances.reduce((prev, next) => prev + next);
      expect(totalSupply).toEqual(total);
    });

    test('name', async () => {
      const name = await heyClient.getName();
      expect(name).toEqual('HeyStack Token');
    });

    test('decimals', async () => {
      const decimals = await heyClient.decimals();
      expect(decimals).toEqual(0);
    });

    test('symbol', async () => {
      const symbol = await heyClient.symbol();
      expect(symbol).toEqual('HEY');
    });

    test('Cannot transfer more than your balance', async () => {
      const previousBalance = await heyClient.balanceOf(charlie);
      await expect(heyClient.transfer(bob, 10000000000, { sender: charlie })).rejects.toThrowError(
        new TransferError(1)
      );
      expect(await heyClient.balanceOf(charlie)).toEqual(previousBalance);
    });

    test('Cannot invoke transfer with "sender" different than tx-sender', async () => {
      await expect(
        heyClient.transfer(bob, 10000000000, {
          sender: charlie,
          senderArg: alice,
        })
      ).rejects.toThrowError(new TransferError(4));
    });
  });
});
