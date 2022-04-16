import { useReadContract, useTypedContract } from '@raidguild/quiver'
import { FC } from 'react'

import { Inbox__factory } from '../../types/typechain'
import { H1 } from '../atoms'

export const Home: FC = () => {
  const { contract } = useTypedContract('', Inbox__factory)
  const { response: message } = useReadContract(contract, 'message', [])
  return (
    <div className="space-y-8 p-4">
      <div className="space-y-4">
        <H1>Home</H1>
        {message}
      </div>
    </div>
  )
}
