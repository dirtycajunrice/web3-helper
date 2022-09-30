import { Contract, Signer, providers, BigNumberish, constants, Signature, utils, BigNumber } from 'ethers';

const ABI = [
  {
    "inputs": [],
    "name": "DOMAIN_SEPARATOR",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "nonces",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" },
      { "internalType": "uint8", "name": "v", "type": "uint8" },
      { "internalType": "bytes32", "name": "r", "type": "bytes32" },
      { "internalType": "bytes32", "name": "s", "type": "bytes32" }
    ],
    "name": "permit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export interface Domain {
  name: string,
  version: string,
  chainId: number,
  verifyingContract: string,
}

class ERC20Permit extends Contract {
  constructor(address: string, signerOrProvider?: Signer | providers.Provider) {
    super(address, ABI, signerOrProvider);
  }

  domain = async (): Promise<Domain> => {
    return {
      name: await this.name(),
      version: '1',
      chainId: 43114,
      verifyingContract: this.address,
    }
  }

  getPermitString = async (
    spender: string,
    nonce?: BigNumberish,
    value: BigNumberish = constants.MaxUint256,
    deadline = constants.MaxUint256
  ): Promise<string> => {
    const owner = await this.signer.getAddress();
    nonce = nonce ?? (await this.nonces(owner));
    const eip712Domain = await this.domain();
    const types = {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };
    const values = { owner, spender, value, nonce, deadline };
    return await (this.signer as providers.JsonRpcSigner)._signTypedData(eip712Domain, types, values)
  }

  getPermitSignatureFromString = (s: string): Signature => {
    return utils.splitSignature(s);
  }
}

export default ERC20Permit;
