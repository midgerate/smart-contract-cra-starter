import { providers } from 'ethers'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'react-hot-toast'
import Web3Modal from 'web3modal'

import { DEFAULT_NETWORK, NETWORK_NAMES } from '../web3/constants'
import { isSupportedChain } from '../web3/helpers'
import { switchChainOnMetaMask } from '../web3/metamask'
import { providerOptions } from '../web3/providerOptions'

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
  theme: 'dark',
})

export type WalletContextType = {
  provider: providers.Web3Provider | null | undefined
  chainId: number | null | undefined
  address: string | null | undefined
  connectWallet: () => Promise<void>
  disconnect: () => void
  isConnecting: boolean
  isConnected: boolean
  isMetamask: boolean
}

export const WalletContext = createContext<WalletContextType>({
  provider: null,
  chainId: null,
  address: null,
  connectWallet: async () => {},
  disconnect: () => undefined,
  isConnecting: true,
  isConnected: false,
  isMetamask: false,
})

type WalletStateType = {
  provider?: providers.Web3Provider | null
  chainId?: number | null
  address?: string | null
}

const isMetamaskProvider = (
  provider: providers.Web3Provider | null | undefined
) => provider?.connection?.url === 'metamask'

export const WalletProvider: React.FC = ({ children }) => {
  const [{ provider, chainId, address }, setWalletState] =
    useState<WalletStateType>({})

  const isConnected: boolean = useMemo(
    () => !!provider && !!address && !!chainId,
    [provider, address, chainId]
  )

  const [isConnecting, setConnecting] = useState<boolean>(true)
  const isMetamask = useMemo(() => isMetamaskProvider(provider), [provider])

  const disconnect = useCallback(async () => {
    web3Modal.clearCachedProvider()
    setWalletState({})
  }, [])

  const setWalletProvider = useCallback(async (provider) => {
    const ethersProvider = new providers.Web3Provider(provider)

    let network = Number(provider.chainId)
    if (!isSupportedChain(network)) {
      const success =
        isMetamaskProvider(ethersProvider) &&
        (await switchChainOnMetaMask(DEFAULT_NETWORK))
      if (!success) {
        const errorMsg = `Network not supported, please switch to ${NETWORK_NAMES[DEFAULT_NETWORK]}`
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }
      network = DEFAULT_NETWORK
    }

    const signerAddress = await ethersProvider.getSigner().getAddress()
    setWalletState({
      provider: ethersProvider,
      chainId: network,
      address: signerAddress,
    })
  }, [])

  const connectWallet = useCallback(async () => {
    try {
      setConnecting(true)

      const modalProvider = await web3Modal.connect()

      await setWalletProvider(modalProvider)

      modalProvider.on('accountsChanged', () => {
        disconnect()
      })
      modalProvider.on('chainChanged', () => {
        disconnect()
      })
    } catch (web3Error) {
      // eslint-disable-next-line no-console
      console.error(web3Error)
      disconnect()
    } finally {
      setConnecting(false)
    }
  }, [setWalletProvider, disconnect])

  useEffect(() => {
    const load = async () => {
      if (web3Modal.cachedProvider) {
        await connectWallet()
      } else {
        setConnecting(false)
      }
    }
    load()
  }, [connectWallet])

  return (
    <WalletContext.Provider
      value={{
        provider,
        address,
        chainId,
        connectWallet,
        isConnected,
        isConnecting,
        disconnect,
        isMetamask,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = (): WalletContextType => useContext(WalletContext)