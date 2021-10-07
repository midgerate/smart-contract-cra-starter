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

import useGlobalState from '../hooks/useGlobalState'
import { authenticateWallet, getExistingAuth } from '../web3/auth'
import { DEFAULT_NETWORK, NETWORK_NAMES } from '../web3/constants'
import { isSupportedChain } from '../web3/helpers'
import { switchChainOnMetaMask } from '../web3/metamask'
import { providerOptions } from '../web3/providerOptions'
// import { connectUser } from '../api/usersApi'

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
  theme: 'dark',
})

export type WalletContextType = {
  provider: providers.Web3Provider | null | undefined
  chainId: number | null | undefined
  address: string | null | undefined
  ensName: string | null | undefined
  authToken: string | null | undefined
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
  authToken: null,
  ensName: null,
  connectWallet: async () => {},
  disconnect: () => undefined,
  isConnecting: true,
  isConnected: false,
  isMetamask: false,
})

const getAuthToken = async (
  ethersProvider: providers.Web3Provider | null
): Promise<string | null> => {
  if (!ethersProvider) return null
  let token = await getExistingAuth(ethersProvider)
  if (!token) {
    token = await authenticateWallet(ethersProvider)
  }
  return token
}

type WalletStateType = {
  provider?: providers.Web3Provider | null
  chainId?: number | null
  address?: string | null
  authToken?: string | null
  ensName?: string | null
}

const isMetamaskProvider = (
  provider: providers.Web3Provider | null | undefined
) => provider?.connection?.url === 'metamask'

export const WalletProvider: React.FC = ({ children }) => {
  const [{ provider, chainId, address, authToken, ensName }, setWalletState] =
    useState<WalletStateType>({})

  const { loggedInUser, setLoggedInUser } = useGlobalState()

  const isConnected: boolean = useMemo(
    () =>
      !!provider && !!address && !!chainId && !!authToken && !!loggedInUser._id,
    [provider, address, chainId, authToken, loggedInUser]
  )

  const [isConnecting, setConnecting] = useState<boolean>(true)
  const isMetamask = useMemo(() => isMetamaskProvider(provider), [provider])

  const disconnect = useCallback(async () => {
    web3Modal.clearCachedProvider()
    setWalletState({})
    setLoggedInUser(null)
  }, [setLoggedInUser])

  const setWalletProvider = useCallback(
    async (prov) => {
      const ethersProvider = new providers.Web3Provider(prov)

      let network = Number(prov.chainId)
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
      const signerName = await ethersProvider.lookupAddress(signerAddress)
      const signerAuthToken = await getAuthToken(ethersProvider)
      // when you want to store user's info on database
      // const [userResponse] = await Promise.all([connectUser()])
      // const userData = await userResponse.json()
      setLoggedInUser({ _id: signerAddress })
      setWalletState({
        provider: ethersProvider,
        chainId: network,
        address: signerAddress,
        authToken: signerAuthToken,
        ensName: signerName,
      })
    },
    [setLoggedInUser]
  )

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
        authToken,
        connectWallet,
        isConnected,
        isConnecting,
        disconnect,
        isMetamask,
        ensName,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = (): WalletContextType => useContext(WalletContext)
