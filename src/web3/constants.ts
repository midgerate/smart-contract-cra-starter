const {
  REACT_APP_MAINNET_RPC: MAINNET_RPC,
  REACT_APP_RINKEBY_RPC: RINKEBY_RPC,
} = process.env

type CurrencyInfo = {
  [chainId: number]: {
    name: string
    symbol: string
  }
}

export const NETWORK_CURRENCIES: CurrencyInfo = {
  1: {
    name: 'Ethereum',
    symbol: 'ETH',
  },
  4: {
    name: 'Ethereum',
    symbol: 'ETH',
  },
}

type StringInfo = {
  [chainId: number]: string
}

export const RPC_URLS: StringInfo = {
  1: MAINNET_RPC ?? '',
  4: RINKEBY_RPC ?? '',
}

export const NETWORK_NAMES: StringInfo = {
  1: 'ETH Mainnet',
  4: 'Rinkeby Testnet',
}

export const NETWORK_LABELS: StringInfo = {
  1: 'Mainnet',
  4: 'Rinkeby',
}

export const EXPLORER_URLS: StringInfo = {
  1: 'https://etherscan.io',
  4: 'https://rinkeby.etherscan.io',
}

export const SUBGRAPH_URLS: StringInfo = {
  // 1: '',
  //4: '',
}

export const COINGECKO_PRICE_API =
  'https://api.coingecko.com/api/v3/simple/price?ids={tokenId}&vs_currencies=USD'

type CoingeckoTokenIdInfo = {
  [symbol: string]: string
}

export const COINGECKO_TOKEN_ID: CoingeckoTokenIdInfo = {
  DAI: 'dai',
  ETH: 'ethereum',
  USDC: 'usd-coin',
}

export const SUPPORTED_NETWORKS: number[] = [4]

export const DEFAULT_NETWORK = SUPPORTED_NETWORKS[0]

export const SUBGRAPH_POLL_INTERVAL = 5000
