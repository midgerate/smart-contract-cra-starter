import { useWallet } from '@raidguild/quiver'
import { FC } from 'react'

import { formatAddress } from '../utils/methods'
export const ConnectWallet: FC = () => {
  const { connectWallet, isConnecting, isConnected, disconnect, address } =
    useWallet()
  return (
    <>
      {!isConnected && (
        <button
          id="button"
          disabled={isConnecting}
          onClick={() => !isConnected && connectWallet()}
        >
          {isConnecting
            ? 'Connecting...'
            : isConnected
            ? 'Connected'
            : 'Connect'}
        </button>
      )}
      {isConnected && (
        <div className="flex items-center">
          <div>{formatAddress(address)}</div>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      )}
    </>
  )
}
