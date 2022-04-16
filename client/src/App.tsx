import { Link } from 'react-router-dom'
import { SWRConfig } from 'swr'

import './App.css'
import Routes from './Routes'
import { ConnectWallet } from './components'
import { H1 } from './components/atoms'
function App() {
  return (
    <SWRConfig
      value={{
        fetcher: fetch,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      }}
    >
      <div className="flex flex-col h-full bg-background-brand text-white">
        <div className=" flex w-full z-10 fixed">
          <div className="p-4 flex w-full justify-between">
            <div>
              <Link to="/">
                <H1>Logo</H1>
              </Link>
            </div>
            <div className="flex-1" />
            <ConnectWallet />
          </div>
        </div>
        <div className="min-h-screen flex-1 overflow-y-auto">
          <div className="mt-20 flex flex-col xl:max-w-7xl lg:max-w-5xl md:max-w-4xl m-auto">
            <Routes />
          </div>
        </div>
      </div>
    </SWRConfig>
  )
}

export default App
