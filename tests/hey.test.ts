import { Client, Provider, ProviderRegistry } from '@blockstack/clarity';
import { cvToString, intCV, stringUtf8CV } from '@stacks/transactions';
import { HeyTokenClient } from '../src/hey-token-client';

let traitClient: Client;
let heyClient: Client;
let provider: Provider;
let heyTokenClient: HeyTokenClient;

const contractDelployer = 'ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA';
const bob = 'ST1TWA18TSWGDAFZT377THRQQ451D1MSEM69C761';

describe('Hey token', () => {
  beforeAll(async () => {
    provider = await ProviderRegistry.createProvider();
    traitClient = new Client(
      `${contractDelployer}.ft-trait`,
      'clarinet/sip-10-ft-standard',
      provider
    );
    heyClient = new Client(`${contractDelployer}.hey`, 'hey', provider);
    heyTokenClient = new HeyTokenClient(contractDelployer, provider);
  });

  afterEach(() => provider.close());

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
        method: { name: 'get-like-count', args: [cvToString(intCV(contentId))] },
      })
    );
    return result;
  }

  async function publishContent(message: string) {
    const tx = heyClient.createTransaction({
      method: {
        name: 'publish-content',
        args: [cvToString(stringUtf8CV(message))],
      },
    });
    tx.sign(bob);
    return heyClient.submitTransaction(tx);
  }

  async function likeContent(contentId: number) {
    const tx = heyClient.createTransaction({
      method: {
        name: 'like-content',
        args: [cvToString(intCV(contentId))],
      },
    });
    tx.sign(bob);
    return heyClient.submitTransaction(tx);
  }

  test('The contracts are valid', async () => {
    await traitClient.checkContract();
    await traitClient.deployContract();

    await heyTokenClient.checkContract();
    await heyTokenClient.deployContract();

    await heyClient.checkContract();
    await heyClient.deployContract();
  });

  describe('publish-content', () => {
    test('calling with no arguments will fail', async () => {
      const query = heyClient.createQuery({
        method: {
          name: 'publish-content',
          args: [],
        },
      });
      await expect(heyClient.submitQuery(query)).rejects.toThrow();
    });

    test('calling with a well-formed arguments', async () => {
      expect(await getContentIndex()).toEqual('(ok 0)');
      const resp = await publishContent('testessage');
      expect(await getContentIndex()).toEqual('(ok 1)');
      expect(resp.success).toBeTruthy();
    });
  });

  describe('like-content', () => {
    test('that it increments like map value', async () => {
      expect(await getLikeCount(0)).toEqual('(ok (tuple (likes 0)))');
      await publishContent(`Greetings, traveller`);
      await likeContent(0);
      await likeContent(0);
      await likeContent(0);
      await likeContent(0);
      expect(await getLikeCount(0)).toEqual('(ok (tuple (likes 4)))');
    });
  });
});
