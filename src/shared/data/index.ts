export * from 'src/shared/data/ChaosBases'
export * from 'src/shared/data/OrderBases'
export * from 'src/shared/data/ShadowBases'
export * from 'src/shared/data/MixedBases'
export * from 'src/shared/data/constants'

import * as ChaosBases from 'src/shared/data/ChaosBases'
import * as OrderBases from 'src/shared/data/OrderBases'
import * as ShadowBases from 'src/shared/data/ShadowBases'
import * as MixedBases from 'src/shared/data/MixedBases'

export const CardBases = {
  ...ChaosBases,
  ...OrderBases,
  ...ShadowBases,
  ...MixedBases,
}

export type CardBaseName = keyof typeof CardBases
export const baseNames = Object.keys(CardBases)
