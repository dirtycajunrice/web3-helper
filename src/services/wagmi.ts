import { createClient, configureChains, chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { getDefaultClient } from "connectkit";
import Chains from '@services/chains';

const chainList = [Chains.bobaAvaxL2, Chains.avalanche, chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum ];
const { chains, provider } = configureChains(chainList, [
  jsonRpcProvider({
    rpc: (chain) => {
      if (chain.id !== Chains.avalanche.id) return null;
      return { http: chain.rpcUrls.default };
    },
    weight: 1,
  }),
  publicProvider({ weight: 2 }),
])

const client = createClient(getDefaultClient({
  autoConnect: true,
  appName: 'cajun.tools',
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'cajun.tools',
        headlessMode: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: false,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
}));

export default client;
