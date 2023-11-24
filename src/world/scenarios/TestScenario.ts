import { RegionTypes } from 'src/world'

export const TestScenario: RegionTypes.TestScenario = {
  name: 'Base Test Scenario',
  height: 100,
  width: 100,
  regions: [
    {
      id: '1',
      name: 'Region 1',
      connectedRegionIds: ['2', '3'],
      population: 0,
      namePath: '',
      border: ''
    },
    {
      id: '2',
      name: 'Region 2',
      connectedRegionIds: ['1', '3'],
      population: 0,
      namePath: '',
      border: ''
    },
    {
      id: '3',
      name: 'Region 3',
      connectedRegionIds: ['1', '2'],
      population: 0,
      namePath: '',
      border: ''
    }
  ]
}
