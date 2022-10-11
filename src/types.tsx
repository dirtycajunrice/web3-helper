
export interface TokenListVersion {
    major: number
    minor: number
    patch: number
}

export interface TokenListTag {
    name: string
    description: string
}

export interface Token {
    chainId: number
    address: string
    symbol: string
    name: string
    decimals: number
    logoURI: string
    tags?: string[]
}
export interface TokenList {
    keywords: string[]
    logoURI: string
    name: string
    tags: Record<string, TokenListTag>
    version: TokenListVersion
    timestamp: string
    tokens: Token[]
}