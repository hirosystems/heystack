import { Client, Provider, Result, Receipt } from "@blockstack/clarity";

const unwrapError = (receipt: Receipt) => {
  if (!receipt.error) throw new Error("No error found");
  const error = receipt.error as unknown as Error;
  const message = error.message.split("\n")[0];
  return parseInt(message.split("Aborted: u")[1], 10);
};

export class TransferError extends Error {
  public code: number;

  constructor(code: number) {
    super(`Transfer rejected with error code ${code}`);
    this.code = code;
  }
}

export class ExampleTokenClient extends Client {
  constructor(principal: string, provider: Provider) {
    super(`${principal}.example-token`, "clarinet/example-token", provider);
  }

  async transfer(
    recipient: string,
    amount: number,
    params: { sender: string; senderArg?: string }
  ): Promise<boolean> {
    const { sender, senderArg } = params;
    const tx = this.createTransaction({
      method: {
        name: "transfer",
        args: [
          `u${amount}`,
          `'${senderArg || sender}`,
          `'${recipient}`,
          "none",
        ],
      },
    });
    await tx.sign(sender);
    const receipt = await this.submitTransaction(tx);
    if (receipt.success) {
      const result = Result.unwrap(receipt);
      return result.startsWith(
        "Transaction executed and committed. Returned: true"
      );
    }
    const error = unwrapError(receipt);
    throw new TransferError(error);
  }

  async balanceOf(owner: string): Promise<number> {
    const query = this.createQuery({
      method: {
        name: "get-balance",
        args: [`'${owner}`],
      },
    });
    const receipt = await this.submitQuery(query);
    return Result.unwrapUInt(receipt);
  }

  async totalSupply(): Promise<number> {
    const query = this.createQuery({
      method: {
        name: "get-total-supply",
        args: [],
      },
    });
    const receipt = await this.submitQuery(query);
    return Result.unwrapUInt(receipt);
  }

  async decimals(): Promise<number> {
    const query = this.createQuery({
      method: {
        name: "get-decimals",
        args: [],
      },
    });
    const receipt = await this.submitQuery(query);
    return Result.unwrapUInt(receipt);
  }

  async symbol(): Promise<string> {
    const query = this.createQuery({
      method: {
        name: "get-symbol",
        args: [],
      },
    });
    const receipt = await this.submitQuery(query);
    return Result.unwrap(receipt).split('"')[1];
  }

  async getName() {
    const query = this.createQuery({
      method: {
        name: "get-name",
        args: [],
      },
    });
    const receipt = await this.submitQuery(query);
    return Result.unwrap(receipt).split('"')[1];
  }
}
