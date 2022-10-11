import type { Chain } from 'wagmi';
import { ReactNode } from "react";
import SVGLogo from "@components/SVGLogo";

type NativeCurrency = {
  decimals: number,
  name: string,
  symbol: string,
  logo: ReactNode
}

const avalanche: Chain & { logo: ReactNode, nativeCurrency: NativeCurrency  } = {
  id: 43_114,
  name: "Avalanche",
  logo: SVGLogo("avalanche", "avax"),
  network: "avalanche",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
    logo: SVGLogo("avalanche", "avax"),
  },
  rpcUrls: {
    default: "https://api.avax.network/ext/bc/C/rpc",
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://snowtrace.io" },
  },
  testnet: false,
  // ens: {
  //  address: '0x4832D668C2c75Fa10C597FD19B116d2E1873ED69'
  //},
  //multicall: {
  //  address: '0x7f3aC7C283d7E6662D886F494f7bc6F1993cDacf',
  //  blockCreated: 9772745
  //}
};

const bobaAvaxL2: Chain & { logo: ReactNode, nativeCurrency: NativeCurrency  } = {
  id: 43_288,
  name: "Boba",
  logo: "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/token/boba.jpg",
  network: "boba",
  nativeCurrency: {
    decimals: 18,
    name: "Boba",
    symbol: "BOBA",
    logo: "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/token/boba.jpg",
  },
  rpcUrls: {
    default: "https://avax.boba.network",
  },
  blockExplorers: {
    default: { name: "BlockExplorer", url: "https://blockexplorer.avax.boba.network/" },
  },
  testnet: false,
  // ens: {
  //  address: '0x4832D668C2c75Fa10C597FD19B116d2E1873ED69'
  //},
  //multicall: {
  //  address: '0x7f3aC7C283d7E6662D886F494f7bc6F1993cDacf',
  //  blockCreated: 9772745
  //}
};

export default {
  avalanche,
  bobaAvaxL2
}