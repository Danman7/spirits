import {
  RegionsRducer,
  RegionActions,
  RegionSelectors,
  Scenarios
} from 'src/world'
import { initialState } from 'src/world/RegionsSlice'

const { regions } = Scenarios.Mythosia

describe('Regions State Slice', () => {
  it('should handle a populating the regions', () => {
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
