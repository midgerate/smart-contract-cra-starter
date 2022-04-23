import { WalletProvider, NetworkConfig } from '@raidguild/quiver'
import WalletConnectProvider from '@walletconnect/web3-provider'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { HashRouter as Router } from 'react-router-dom'
import { IProviderOptions } from 'web3modal'

import App from './App'
import reportWebVitals from './reportWebVitals'

const SUPPORTED_NETWORKS: NetworkConfig = {
  '0x1': {
    chainId: '0x1',
    name: 'Mainnet',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    rpc: 'https://mainnet.infura.io/v3/<your infura project id>',
  },
  '0x4': {
    chainId: '0x4',
    name: 'Rinkeby',
    symbol: 'ETH',
    explorer: 'https://rinkeby.etherscan.io',
    rpc: 'https://rinkeby.infura.io/v3/<your infura project id>',
  },
  '0x539': {
    chainId: '0x539',
    name: 'Hardhat',
    symbol: 'ETH',
    explorer: 'http://localhost:1234',
    rpc: 'http://localhost:8545',
  },
  '0x89': {
    chainId: '0x89',
    name: 'Polygon',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    rpc: 'https://polygon-rpc.com/',
  },
  '0x13881': {
    chainId: '0x13881',
    name: 'Mumbai Testnet',
    symbol: 'MATIC',
    explorer: 'https://mumbai.polygonscan.com',
    rpc: 'https://matic-mumbai.chainstacklabs.com',
  },
}

const providerOptions: IProviderOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        1: SUPPORTED_NETWORKS['0x1'].rpc,
        4: SUPPORTED_NETWORKS['0x4'].rpc,
        1337: SUPPORTED_NETWORKS['0x539'].rpc,
      },
    },
  },
  // .. Other providers
}

const web3modalOptions = {
  cacheProvider: true,
  providerOptions,
  theme: 'dark',
}

const DEFAULT_CHAIN_ID = '0x539' // Used to switch to if the user is on an unsupported network

ReactDOM.render(
  <React.StrictMode>
    <WalletProvider
      web3modalOptions={web3modalOptions}
      networks={SUPPORTED_NETWORKS}
      // Optional if you want to auto switch the network
      defaultChainId={DEFAULT_CHAIN_ID}
      // Optional but useful to handle events.
      handleModalEvents={(eventName, error) => {
        if (error) {
          console.error(error.message)
        }

        console.log(eventName)
      }}
    >
      <Router>
        <App />
      </Router>
    </WalletProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
