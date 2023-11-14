import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  Scenarios,
  RegionActions,
  RegionSelectors,
  Map,
  RegionTypes
} from 'src/world'

export const App = () => {
  const dispatch = useAppDispatch()
  const regions: RegionTypes.Region[] = useAppSelector(
    RegionSelectors.getRegions
  )

  useEffect(() => {
    dispatch(RegionActions.populateRegions(Scenarios.Mythosia))
  }, [])

  return (
    <>
      <Map width={1400} height={800} regions={regions} />
    </>
  )
}
