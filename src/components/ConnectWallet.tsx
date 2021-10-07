import { FC } from 'react'
import { HiX } from 'react-icons/hi'

import { useWallet } from '../contexts/WalletContext'
import { formatAddress } from '../utils/methods'
import { Button } from './atoms'
export const ConnectWallet: FC = () => {
  const {
    connectWallet,
    isConnecting,
    isConnected,
    disconnect,
    ensName,
    address,
  } = useWallet()
  return (
    <>
      {!isConnected && (
        <Button
          id="button"
          disabled={isConnecting}
          onClick={() => !isConnected && connectWallet()}
        >
          {isConnecting
            ? 'Connecting...'
            : isConnected
            ? 'Connected'
            : 'Connect'}
        </Button>
      )}
      {isConnected && (
        <div className="flex items-center">
          <div>{formatAddress(address, ensName)}</div>
          <HiX onClick={() => disconnect()} />
        </div>
      )}
    </>
  )
}
