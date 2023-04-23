import type { AddEthereumChainParameter } from '@web3-react/types'

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
}

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
}

const ONE: AddEthereumChainParameter['nativeCurrency'] = {
    name: 'Harmony',
    symbol: 'ONE',
    decimals: 18,
}

const AVAX: AddEthereumChainParameter['nativeCurrency'] = {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18
}

const FTM: AddEthereumChainParameter['nativeCurrency'] = {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18
}

const BNB: AddEthereumChainParameter['nativeCurrency'] = {
    name: "Binance Coin",
    symbol: "BNB",
    decimals: 18
}

const JEWEL: AddEthereumChainParameter['nativeCurrency'] = {
    name: "Jewel",
    symbol: "JEWEL",
    decimals: 18
}

export interface ChainInformation {
    urls: string[]
    name: string
    nativeCurrency: AddEthereumChainParameter['nativeCurrency']
    blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
    enabled: boolean
    testnet: boolean
}

export interface AddChainParameter extends Omit<AddEthereumChainParameter, 'chainId'>  {
    chainId: string
}
export function getAddChainParameters(chainId: number): AddChainParameter | number {
    if (chainId === undefined) return chainId
    const c = CHAINS[chainId]
    return {
        chainId: "0x" + chainId.toString(16),
        chainName: c.name,
        nativeCurrency: c.nativeCurrency,
        rpcUrls: c.urls,
        blockExplorerUrls: c.blockExplorerUrls,
    }
}

export const CHAINS: { [chainId: number]: ChainInformation } = {
    56: {
        urls: ['https://bsc-dataseed.binance.org/'],
        name: 'Smart Chain',
        nativeCurrency: BNB,
        blockExplorerUrls: ['https://bscscan.com'],
        enabled: false,
        testnet: false,
    },
    97: {
        urls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        name: 'Smart Chain Testnet',
        nativeCurrency: BNB,
        blockExplorerUrls: ['https://testnet.bscscan.com'],
        enabled: false,
        testnet: true,
    },
    137: {
        urls: ['https://polygon-rpc.com'],
        name: 'Polygon',
        nativeCurrency: MATIC,
        blockExplorerUrls: ['https://polygonscan.com'],
        enabled: false,
        testnet: false,
    },
    53935: {
        urls: [
            'https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc',
        ],
        name: 'DFK Chain',
        nativeCurrency: JEWEL,
        blockExplorerUrls: ['https://subnets.avax.network/defi-kingdoms/'],
        enabled: true,
        testnet: false,
    },
    80001: {
        urls: ['https://rpc-mumbai.maticvigil.com'],
        name: 'Polygon Mumbai',
        nativeCurrency: MATIC,
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
        enabled: false,
        testnet: true,
    },
    250: {
        urls: [
            "https://rpc.ftm.tools/",
            "https://rpc.fantom.network"
        ],
        name: 'Fantom',
        nativeCurrency: FTM,
        blockExplorerUrls: ['https://ftmscan.com'],
        enabled: false,
        testnet: false,
    },
    4002: {
        urls: ["https://rpc.testnet.fantom.network"],
        name: 'Fantom Testnet',
        nativeCurrency: FTM,
        blockExplorerUrls: ['https://testnet.ftmscan.com/'],
        enabled: false,
        testnet: true,
    },
    43114: {
        urls: ["https://api.avax.network/ext/bc/C/rpc"],
        name: "Avalanche",
        nativeCurrency: AVAX,
        blockExplorerUrls: ["https://snowtrace.io"],
        enabled: false,
        testnet: false,
    },
    43113: {
        urls: ["https://api.avax-test.network/ext/bc/C/rpc"],
        name: "Avalanche Fuji Testnet",
        nativeCurrency: AVAX,
        blockExplorerUrls: ["https://testnet.snowtrace.io/"],
        enabled: false,
        testnet: true,
    },
}

export const ENABLED_CHAINS =
    Object.entries(CHAINS)
        .filter(([id, chain]) => chain.enabled)