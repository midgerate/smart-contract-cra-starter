import { SWRConfig } from 'swr'

import Routes from './Routes'
function App() {
  return (
    <SWRConfig
      value={{
        fetcher: fetch,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      }}
    >
      <Routes />
    </SWRConfig>
  )
}

export default App
