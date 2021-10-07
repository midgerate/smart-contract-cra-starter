import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { HashRouter as Router } from 'react-router-dom'

import App from './App'
import { WalletProvider } from './contexts/WalletContext'
import { GlobalStateProvider } from './hooks/useGlobalState'
import reportWebVitals from './reportWebVitals'
import { theme } from './utils/theme'

ReactDOM.render(
  <React.StrictMode>
    <GlobalStateProvider>
      <WalletProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
          }}
        />
        <Router>
          <ChakraProvider theme={theme}>
            <App />
          </ChakraProvider>
        </Router>
      </WalletProvider>
    </GlobalStateProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
