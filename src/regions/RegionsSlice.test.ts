import {
  RegionsRducer,
  RegionActions,
  MapGeneration,
  RegionTypes
} from 'src/regions'
import { initialState, RegionsState } from 'src/regions/RegionsSlice'

let regions: RegionTypes.Region[]
let state: RegionsState

describe('Regions State Slice', () => {
  beforeEach(() => {
    regions = MapGeneration.generateMap(5)

    state = RegionsRducer(initialState, RegionActions.populateRegions(regions))
  })

  it('should handle a populating the regions', () => {
    expect(state).toEqual(regions)
  })

  it('should handle region food supply change when advancing the turn', () => {
    const newState = RegionsRducer(state, RegionActions.advanceTurn(1))

    expect(newState[0].foodSupply).toEqual(3)
  })
})
