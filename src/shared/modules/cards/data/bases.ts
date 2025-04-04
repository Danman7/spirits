import * as ChaosBases from 'src/shared/modules/cards/data/ChaosBases'
import * as MixedBases from 'src/shared/modules/cards/data/MixedBases'
import * as OrderBases from 'src/shared/modules/cards/data/OrderBases'
import * as ShadowBases from 'src/shared/modules/cards/data/ShadowBases'

export const CardBases = {
  ...ChaosBases,
  ...OrderBases,
  ...ShadowBases,
  ...MixedBases,
}
