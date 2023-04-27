import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store'
import { MapGeneration, RegionActions, RegionSelectors } from 'src/regions'

export const App = () => {
  const dispatch = useAppDispatch()
  const regions = useAppSelector(RegionSelectors.getRegions)

  useEffect(() => {
    const generatedRegions = MapGeneration.generateMap(10)
    dispatch(RegionActions.populateRegions(generatedRegions))
  }, [])

  return <div>{JSON.stringify(regions)}</div>
}
