import WalletConnectProvider from '@walletconnect/web3-provider'
import { WalletLink } from 'walletlink'
import { IProviderOptions } from 'web3modal'

import { RPC_URLS } from './constants'
import CoinbaseLogo from './images/coinbase-wallet.svg'

interface ConnectorOptions {
  appName: string
  networkUrl: string
  chainId: number
}

export const providerOptions: IProviderOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        137: RPC_URLS[137],
      },
    },
  },
  'custom-walletlink-matic': {
    display: {
      logo: CoinbaseLogo,
      name: 'Coinbase Matic',
      description: 'Scan with WalletLink to connect',
    },
    options: {
      appName: 'Super Galactic',
      networkUrl: RPC_URLS[137],
      chainId: 137,
    },
    package: WalletLink,
    connector: async (_: unknown, options: ConnectorOptions) => {
      const { appName, networkUrl, chainId } = options
      const walletLink = new WalletLink({
        appName,
      })
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId)
      await provider.enable()
      return provider
    },
  },
}
