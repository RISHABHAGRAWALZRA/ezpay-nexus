import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NexusProvider, TransferButton } from '@avail-project/nexus-widgets';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NexusProvider
      config={{
        debug: false, // true to view debug logs
        network: 'testnet', // "mainnet" (default) or "testnet"
      }}
    >

      <App />
    </NexusProvider>
  </StrictMode>,
)
