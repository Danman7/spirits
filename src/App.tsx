import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux'
import {
  Scenarios,
  RegionActions,
  RegionSelectors,
  Map,
  RegionTypes
} from 'src/world'

export const App = () => {
  const dispatch = useAppDispatch()
  const regionsFromState: RegionTypes.GameRegion[] = useAppSelector(
    RegionSelectors.getRegions
  )

  const { regions, width, height } = Scenarios.Mythosia

  useEffect(() => {
    dispatch(RegionActions.populateRegions(regions))
  }, [])

  return (
    <>
      <Map width={width} height={height} regions={regionsFromState} />
    </>
  )
}
