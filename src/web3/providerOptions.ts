import WalletConnectProvider from '@walletconnect/web3-provider'
import { WalletLink } from 'walletlink'
import { IProviderOptions } from 'web3modal'

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
        1: process.env.REACT_APP_MAINNET_RPC,
        4: process.env.REACT_APP_RINKEBY_RPC,
      },
    },
  },
  'custom-walletlink-rinkeby': {
    display: {
      logo: CoinbaseLogo,
      name: 'Coinbase Rinkeby',
      description: 'Scan with WalletLink to connect',
    },
    options: {
      appName: 'NFTGenerator',
      networkUrl: process.env.REACT_APP_RINKEBY_RPC,
      chainId: 4,
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
  'custom-walletlink-mainnet': {
    display: {
      logo: CoinbaseLogo,
      name: 'Coinbase Mainnet',
      description: 'Scan with WalletLink to connect',
    },
    options: {
      appName: 'NFTGenerator',
      networkUrl: process.env.REACT_APP_MAINNET_RPC,
      chainId: 1,
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
