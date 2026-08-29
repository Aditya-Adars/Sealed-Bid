import { OneAMWalletAdapter, buildOneAMProviders } from "midnight-wallet-kit";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { CompiledContract } from "@midnight-ntwrk/compact-js";
import { sampleSigningKey } from "@midnight-ntwrk/compact-runtime";
import { createUnprovenDeployTx, submitTxAsync } from "@midnight-ntwrk/midnight-js-contracts";
import { ZKConfigProvider, createZKIR, createProverKey, createVerifierKey } from "@midnight-ntwrk/midnight-js-types";
import { Contract } from "../generated/sealed-bid-auction/contract/index.js";

const DEFAULT_CONTRACT_NAME = "SealedBidAuction";
const ZK_ASSET_PATH = "/zk/sealed-bid-auction/";

export type BrowserDeployResult = {
  contractAddress: string;
};

class CustomZkConfigProvider extends ZKConfigProvider<string> {
  constructor(private baseUrl: string) {
    super();
  }

  private cleanId(circuitId: string): string {
    return circuitId.includes("#") ? circuitId.split("#").pop()! : circuitId;
  }

  async getZKIR(circuitId: string) {
    const name = this.cleanId(circuitId);
    const res = await fetch(`${this.baseUrl}zkir/${name}.bzkir`);
    if (!res.ok) throw new Error(`Failed to fetch ZKIR for ${name}: ${res.statusText}`);
    return createZKIR(new Uint8Array(await res.arrayBuffer()));
  }

  async getProverKey(circuitId: string) {
    const name = this.cleanId(circuitId);
    const res = await fetch(`${this.baseUrl}keys/${name}.prover`);
    if (!res.ok) throw new Error(`Failed to fetch prover key for ${name}: ${res.statusText}`);
    return createProverKey(new Uint8Array(await res.arrayBuffer()));
  }

  async getVerifierKey(circuitId: string) {
    const name = this.cleanId(circuitId);
    const res = await fetch(`${this.baseUrl}keys/${name}.verifier`);
    if (!res.ok) throw new Error(`Failed to fetch verifier key for ${name}: ${res.statusText}`);
    return createVerifierKey(new Uint8Array(await res.arrayBuffer()));
  }
}

export async function connectPreprod1AM(): Promise<OneAMWalletAdapter> {
  setNetworkId("preprod");
  const adapter = new OneAMWalletAdapter({ network: "preprod" });
  await adapter.connect();
  return adapter;
}

export async function deployPreprodContract(
  adapter: OneAMWalletAdapter,
  contractName = DEFAULT_CONTRACT_NAME,
  itemDescription = "Sealed-bid item"
): Promise<BrowserDeployResult> {
  setNetworkId("preprod");
  const zkUrl = new URL(ZK_ASSET_PATH, window.location.origin).toString();
  const providers = await buildOneAMProviders(adapter, {
    contractName,
    zkConfigBaseUrl: zkUrl
  });

  const zkConfigProvider = new CustomZkConfigProvider(zkUrl);

  // Create an initial private state for the auctioneer deployer
  const initialPrivateState = {
    secretKey: new Uint8Array(32).fill(1),
    bidAmount: 0n,
    bidSalt: new Uint8Array(32).fill(2)
  };

  // The SealedBidAuction contract constructor calls localSecretKey to derive
  // the auctioneer identity, so we must provide real witness functions.
  const witnesses = {
    localSecretKey: (ctx: any) => [ctx.privateState, initialPrivateState.secretKey],
    localBidAmount: (ctx: any) => [ctx.privateState, initialPrivateState.bidAmount],
    localBidSalt: (ctx: any) => [ctx.privateState, initialPrivateState.bidSalt]
  };

  const compiledContract = CompiledContract.make(contractName, Contract).pipe(
    CompiledContract.withWitnesses(witnesses),
    CompiledContract.withCompiledFileAssets(ZK_ASSET_PATH)
  );

  const privateStateId = `${DEFAULT_CONTRACT_NAME}PrivateState`;

  const deployTxData = await (createUnprovenDeployTx as any)(
    { zkConfigProvider, walletProvider: providers.walletProvider },
    {
      compiledContract,
      args: [itemDescription],
      privateStateId,
      initialPrivateState,
      signingKey: sampleSigningKey()
    }
  );

  const contractAddress = deployTxData.public.contractAddress;

  await (submitTxAsync as any)(providers, { unprovenTx: deployTxData.private.unprovenTx });

  await (providers as any).privateStateProvider.setContractAddress(contractAddress);
  await (providers as any).privateStateProvider.set(privateStateId, deployTxData.private.initialPrivateState);
  await (providers as any).privateStateProvider.setSigningKey(contractAddress, deployTxData.private.signingKey);

  return { contractAddress };
}
