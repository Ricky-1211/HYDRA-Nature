import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'
import './index.css'
import { disableConsoleInProduction } from './utils/disableConsole'

// Override console methods in production mode (keeps console.error active for critical errors)
disableConsoleInProduction({ preserveError: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
