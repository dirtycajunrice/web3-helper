import { configureChains, createClient, Chain } from "wagmi";
import { mainnet, dfk, avalanche } from "wagmi/chains"
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';


import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  imTokenWallet,
  omniWallet,
  trustWallet,
  braveWallet,
  argentWallet,
  ledgerWallet,
  safeWallet,
} from '@rainbow-me/rainbowkit/wallets';


const appName = 'DFKHelper';

const defaultChains: Chain[] = [
  mainnet, avalanche, {...dfk, contracts: { multicall3: { address: '0xcA11bde05977b3631167028862bE2a173976CA11', blockCreated: 14790551 } }}
]
const { chains, provider } = configureChains(
  defaultChains,
  [
    jsonRpcProvider({
      priority: 0,
      rpc: (chain) => ({
        http: chain.rpcUrls.default.http[0],
      }),
    }),
    publicProvider({ priority: 1 })
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains, shimDisconnect: true }),
      metaMaskWallet({ chains, shimDisconnect: true }),
      walletConnectWallet({ chains }),
      safeWallet({ chains })
    ],
  },
  {
    groupName: 'Popular',
    wallets: [
      ledgerWallet({ chains }),
      trustWallet( { chains, shimDisconnect: true }),
      braveWallet( { chains, shimDisconnect: true }),
      coinbaseWallet({ appName, chains }),
    ],
  },
  {
    groupName: 'Others',
    wallets: [
      rainbowWallet({ chains, shimDisconnect: true }),
      imTokenWallet( { chains }),
      omniWallet( { chains }),
      argentWallet( { chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

export {
  chains,
  wagmiClient
}