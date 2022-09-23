import type { ConfigOptions } from '@web3modal/react'
import { chains } from '@web3modal/ethereum';
import { Chain } from '@wagmi/core';

export const harmony: Chain = {
  id: 1_666_600_000,
  name: 'Harmony',
  network: 'harmony',
  nativeCurrency: {
    decimals: 18,
    name: 'Harmony',
    symbol: 'HMY'
  },
  rpcUrls: {
    default: "https://api.harmony.one",
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.harmony.one' }
  },
  testnet: false
}

export const web3ModalConfig: ConfigOptions = {
  projectId: 'a2ce2af5e4c09f1ee3d4b742177c24e5',
  theme: 'dark',
  accentColor: 'blue',
  ethereum: {
    appName: 'cajun.tools',
    chains: [
      chains.avalanche,
      chains.fantom,
      chains.mainnet,
      chains.polygon,
      chains.optimism,
      chains.binanceSmartChain,
      harmony
    ],
    autoConnect: true
  },
}