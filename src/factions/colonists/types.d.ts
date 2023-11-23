import { FactionTypes } from 'src/factions'

export type ColonistUnitId = 'worker'

export interface Unit extends FactionTypes.Unit {
  name: ColonistUnitId
}
