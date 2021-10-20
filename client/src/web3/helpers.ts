import { EXPLORER_URLS, SUPPORTED_NETWORKS } from './constants'

export const getTransactionUrl = (chainId: number, hash: string): string =>
  `${EXPLORER_URLS[chainId]}/tx/${hash}`

export const isSupportedChain = (chainId: number): boolean =>
  SUPPORTED_NETWORKS.includes(chainId)

export const timeout = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
