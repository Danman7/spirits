import {
  RegionsRducer,
  RegionActions,
  MapGeneration,
  RegionSelectors
} from 'src/world'
import { initialState } from 'src/world/RegionsSlice'

describe('Regions State Slice', () => {
  it('should handle a populating the regions', () => {
    const regions = MapGeneration.generateMap(5)

    const state = RegionsRducer(
      initialState,
      RegionActions.populateRegions(regions)
    )

    const expectedState = RegionSelectors.getRegions({
      regions: state
    })

    expect(state).toEqual(expectedState)
  })
})
