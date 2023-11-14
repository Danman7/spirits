import { FactionTypes } from 'src/factions'

export type ColonistUnitId = 'gatherer'

export interface Unit extends FactionTypes.Unit {
  name: ColonistUnitId
}
