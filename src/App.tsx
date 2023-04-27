import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { generateMap } from './regions/map-generation'
import { getRegions } from './regions/RegionSelectors'
import { populateRegions } from './regions/RegionsSlice'

export const App = () => {
  const dispatch = useAppDispatch()
  const regions = useAppSelector(getRegions)

  useEffect(() => {
    const generatedRegions = generateMap(10)
    dispatch(populateRegions(generatedRegions))
  }, [])

  return <div>{JSON.stringify(regions)}</div>
}
