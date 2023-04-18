import { useEffect } from 'react'

import { createRandomRegions } from './regions/RegionUtils'

function App() {
  const regions = createRandomRegions(10)

  useEffect(() => {}, [])

  console.log(regions)

  return <div>Here we are!</div>
}

export default App
