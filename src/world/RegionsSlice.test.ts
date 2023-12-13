import {
  RegionsRducer,
  RegionActions,
  RegionSelectors,
  Scenarios,
  RegionTypes
} from 'src/world'
import { initialState } from 'src/world/RegionsSlice'

const { regions } = Scenarios.TestScenario

describe('Regions State Slice', () => {
  it('should handle populating the regions', () => {
    const state = RegionsRducer(
      initialState,
      RegionActions.populateRegions(regions)
    )

    const expectedState = RegionSelectors.getRegions({
      regions
    })

    expect(state).toEqual(expectedState)
  })

  it('should handle region population number update', () => {
    const testRegions = [
      regions[0],
      { ...regions[1], population: [RegionTypes.PopulationType.Dweller] },
      {
        ...regions[2],
        population: [
          RegionTypes.PopulationType.Dweller,
          RegionTypes.PopulationType.Dweller
        ]
      }
    ]

    const state = RegionsRducer(testRegions, RegionActions.updatePopulations())

    expect(state[0].population.length).toBe(0)
    expect(state[1].population.length).toBe(1)
    expect(state[2].population.length).toBe(3)
  })

  it('should handle region population type update', () => {
    const testRegions = [
      {
        ...regions[0],
        population: [
          RegionTypes.PopulationType.Dweller,
          RegionTypes.PopulationType.Colonist
        ]
      },
      {
        ...regions[1],
        population: [
          RegionTypes.PopulationType.Colonist,
          RegionTypes.PopulationType.Colonist,
          RegionTypes.PopulationType.Dweller
        ]
      }
    ]

    const state = RegionsRducer(testRegions, RegionActions.updatePopulations())

    expect(state[0].population.length).toBe(3)
    expect(state[0].population).toEqual([
      RegionTypes.PopulationType.Dweller,
      RegionTypes.PopulationType.Colonist,
      RegionTypes.PopulationType.Colonist
    ])

    expect(state[1].population.length).toBe(4)
    expect(state[1].population).toEqual([
      RegionTypes.PopulationType.Dweller,
      RegionTypes.PopulationType.Colonist,
      RegionTypes.PopulationType.Colonist,
      RegionTypes.PopulationType.Colonist
    ])
  })
})
