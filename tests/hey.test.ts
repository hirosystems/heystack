import { Client, Provider, ProviderRegistry } from '@blockstack/clarity';
import { cvToString, uintCV, stringUtf8CV } from '@stacks/transactions';
import { HeyTokenClient } from './hey-token-client';

let traitClient: Client;
let heyClient: Client;
let provider: Provider;
let heyTokenClient: HeyTokenClient;

const contractDelployer = 'ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA';
const bob = 'ST1TWA18TSWGDAFZT377THRQQ451D1MSEM69C761';
const charles = 'ST50GEWRE7W5B02G3J3K19GNDDAPC3XPZPYQRQDW';
const derek = 'ST26AE5W55C7MCSH2MRTT22K2555YWJ9BFRCW56YX';

describe('Hey token', () => {
  beforeEach(async () => {
    provider = await ProviderRegistry.createProvider();
    traitClient = new Client(
      `${contractDelployer}.ft-trait`,
      'clarinet/sip-10-ft-standard',
      provider
    );
    heyTokenClient = new HeyTokenClient(contractDelployer, provider);
    heyClient = new Client(`${contractDelployer}.hey`, 'hey', provider);
  });

  afterEach(() => provider.close());

  test('The contracts are valid', async () => {
    await traitClient.checkContract();
    await traitClient.deployContract();
    await heyTokenClient.checkContract();
    await heyTokenClient.deployContract();
    await heyClient.checkContract();
    await heyClient.deployContract();
  });

  describe('Contract functions', () => {
    beforeEach(async () => {
      await traitClient.deployContract();
      await heyTokenClient.deployContract();
      await heyClient.deployContract();
    });

    async function getContentIndex() {
      const { result } = await heyClient.submitQuery(
        heyClient.createQuery({
          method: { name: 'get-content-index', args: [] },
        })
      );
      return result;
    }

    async function getLikeCount(contentId: number) {
      const { result } = await heyClient.submitQuery(
        heyClient.createQuery({
          method: { name: 'get-like-count', args: [cvToString(uintCV(contentId))] },
        })
      );
      return result;
    }

    async function sendMessage(from: string, message: string) {
      const tx = heyClient.createTransaction({
        method: { name: 'send-message', args: [cvToString(stringUtf8CV(message)), 'none'] },
      });
      tx.sign(from);
      return heyClient.submitTransaction(tx);
    }

    async function likeMessage(from: string, contentId: number) {
      const tx = heyClient.createTransaction({
        method: { name: 'like-message', args: [cvToString(uintCV(contentId))] },
      });
      tx.sign(from);
      return heyClient.submitTransaction(tx);
    }

    async function requestHey(principal: string) {
      const tx = heyClient.createTransaction({
        method: { name: 'request-hey', args: [`'${principal}`] },
      });
      tx.sign(principal);
      return heyClient.submitTransaction(tx);
    }

    describe('(send-message)', () => {
      test('calling with no arguments will fail', async () => {
        const query = heyClient.createQuery({
          method: { name: 'send-message', args: [] },
        });
        await expect(heyClient.submitQuery(query)).rejects.toThrow();
      });

      test('calling with a well-formed arguments', async () => {
        await requestHey(bob);
        expect(await getContentIndex()).toEqual('(ok u0)');
        const resp = await sendMessage(bob, 'testessage');
        expect(await getContentIndex()).toEqual('(ok u1)');
        expect(resp.success).toBeTruthy();
      });

      test('principal is saved in a map', async () => {
        await requestHey(bob);
        await sendMessage(bob, 'wat een mooie bezienswaardigheid');
        const { result } = await heyClient.submitQuery(
          heyClient.createQuery({
            method: { name: 'get-message-publisher', args: ['u1'] },
          })
        );
        expect(result).toContain(bob);
      });
    });

    describe('(like-message)', () => {
      test('that nothing happens when user has no HEY', async () => {
        await sendMessage(bob, `hello everybody, it's me`);
        await likeMessage(bob, 0);
      });

      test('it increments likes-state map value', async () => {
        expect(await getLikeCount(0)).toEqual('(ok (tuple (likes u0)))');
        await requestHey(charles);
        await requestHey(bob);

        const bobsBalance = await heyTokenClient.balanceOf(bob);
        const charlesBalance = await heyTokenClient.balanceOf(charles);

        expect(bobsBalance).toEqual(1);
        expect(charlesBalance).toEqual(1);
        await sendMessage(charles, `Greetings, traveller`);
        await likeMessage(bob, 1);

        const bobsBalance2 = await heyTokenClient.balanceOf(bob);
        const charlesBalance2 = await heyTokenClient.balanceOf(charles);
        expect(bobsBalance2).toEqual(0);
        expect(charlesBalance2).toEqual(1);
        expect(await getLikeCount(1)).toEqual('(ok (tuple (likes u1)))');
      });
    });

    describe('(request-hey)', () => {
      test('tokens are distributed to principal', async () => {
        await requestHey(bob);
        await requestHey(bob);
        const bobsBalance = await heyTokenClient.balanceOf(bob);
        expect(bobsBalance).toEqual(2);
      });

      test('tokens can only be sent to the contract caller', async () => {
        const tx = heyClient.createTransaction({
          method: { name: 'request-hey', args: [`'${bob}`] },
        });
        tx.sign(charles);
        await heyClient.submitTransaction(tx);
        expect(await heyTokenClient.balanceOf(bob)).toEqual(0);
      });
    });

    describe('(transfer-hey)', () => {
      test('tokens are transferred', async () => {
        await requestHey(bob);
        await requestHey(charles);

        const bobsBalance = await heyTokenClient.balanceOf(bob);
        const charlesBalance = await heyTokenClient.balanceOf(charles);

        expect(bobsBalance).toEqual(1);
        expect(charlesBalance).toEqual(1);

        const tx = heyClient.createTransaction({
          method: { name: 'transfer-hey', args: [`u1`, `'${charles}`] },
        });
        tx.sign(bob);
        await heyClient.submitTransaction(tx);

        const bobsBalance2 = await heyTokenClient.balanceOf(bob);
        const charlesBalance2 = await heyTokenClient.balanceOf(charles);
        expect(bobsBalance2).toEqual(0);
        expect(charlesBalance2).toEqual(2);
      });
    });
  });
});
