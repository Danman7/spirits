import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from 'src/App'
import { UserProvider } from 'src/shared/user'
import { defaultTheme, GlobalStyles } from 'src/shared/styles'
import { ThemeProvider } from 'styled-components'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <UserProvider>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </UserProvider>
  </StrictMode>,
)
