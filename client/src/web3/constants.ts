const { REACT_APP_MATIC_RPC: MATIC_RPC } = process.env

type CurrencyInfo = {
  [chainId: number]: {
    name: string
    symbol: string
  }
}

export const NETWORK_CURRENCIES: CurrencyInfo = {
  137: {
    name: 'Matic',
    symbol: 'MATIC',
  },
}

type StringInfo = {
  [chainId: number]: string
}

export const RPC_URLS: StringInfo = {
  137: MATIC_RPC ?? 'https://rpc-mainnet.maticvigil.com',
}

export const NETWORK_NAMES: StringInfo = {
  137: 'Matic',
}

export const NETWORK_LABELS: StringInfo = {
  137: 'Matic',
}

export const EXPLORER_URLS: StringInfo = {
  137: 'https://polygonscan.com',
}

export const COINGECKO_PRICE_API =
  'https://api.coingecko.com/api/v3/simple/price?ids={tokenId}&vs_currencies=USD'

type CoingeckoTokenIdInfo = {
  [symbol: string]: string
}

export const COINGECKO_TOKEN_ID: CoingeckoTokenIdInfo = {
  MATIC: 'matic-network',
}

export const SUPPORTED_NETWORKS: number[] = [137]

export const DEFAULT_NETWORK = SUPPORTED_NETWORKS[0]

export const SUBGRAPH_POLL_INTERVAL = 5000
