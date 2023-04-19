import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { getRegions } from './regions/RegionSelectors'
import { populateRegions } from './regions/RegionsSlice'
import { createRandomRegions } from './regions/RegionUtils'

export const App = () => {
  const dispatch = useAppDispatch()
  const regions = useAppSelector(getRegions)

  useEffect(() => {
    const generatedRegions = createRandomRegions(10)
    dispatch(populateRegions(generatedRegions))
  }, [])

  return <div>{JSON.stringify(regions)}</div>
}
