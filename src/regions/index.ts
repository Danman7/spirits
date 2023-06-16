import * as MapGeneration from 'src/regions/map-generation'
import * as RegionTypes from 'src/regions/RegionTypes.d'
import * as RegionSelectors from 'src/regions/RegionSelectors'
import * as Scenarios from 'src/regions/Scenarios'
import { Region } from 'src/regions/components/Region'
import { Map } from 'src/regions/components/Map'

import { RegionActions, RegionsRducer } from 'src/regions/RegionsSlice'

export {
  Scenarios,
  MapGeneration,
  RegionTypes,
  RegionSelectors,
  RegionActions,
  Region,
  Map,
  RegionsRducer
}
