import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import { App } from 'src/App'
import { store } from 'src/state'
import './reset.css'
import { defaultTheme } from './theme'
import { GlobalStyles } from './styles'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <GlobalStyles />
      <ThemeProvider theme={defaultTheme}>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
)
