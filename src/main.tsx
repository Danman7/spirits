import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from 'src/App'

import { Providers } from 'src/shared/components/Providers'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)
