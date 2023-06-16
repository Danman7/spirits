import {
  RegionsRducer,
  RegionActions,
  MapGeneration,
  RegionSelectors
} from 'src/regions'
import { initialState } from 'src/regions/RegionsSlice'

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

  // it('should handle region food supply change when advancing the turn', () => {
  //   const state: RegionsState = [
  //     createNewBaseRegion({
  //       name: 'Test Region',
  //       foodMultiplier: 1,
  //       populationNumber: 3
  //     }),
  //     createNewBaseRegion({
  //       name: 'Test Region',
  //       foodMultiplier: 2,
  //       populationNumber: 2
  //     })
  //   ]

  //   const newState = RegionsRducer(state, RegionActions.advanceTurn(1))

  //   expect(newState[0].foodSupply).toEqual(3)
  //   expect(newState[1].foodSupply).toEqual(4)
  // })
})
