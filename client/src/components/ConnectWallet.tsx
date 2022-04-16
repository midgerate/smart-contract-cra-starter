import { useWallet } from '@raidguild/quiver'
import { FC } from 'react'
import { HiX } from 'react-icons/hi'

import { formatAddress } from '../utils/methods'
import { Button } from './atoms'
export const ConnectWallet: FC = () => {
  const { connectWallet, isConnecting, isConnected, disconnect, address } =
    useWallet()
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
          <div>{formatAddress(address)}</div>
          <HiX onClick={() => disconnect()} />
        </div>
      )}
    </>
  )
}
