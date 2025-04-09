import * as ChaosBases from 'src/shared/modules/cards/data/bases.chaos'
import * as MixedBases from 'src/shared/modules/cards/data/bases.mixed'
import * as OrderBases from 'src/shared/modules/cards/data/bases.order'
import * as ShadowBases from 'src/shared/modules/cards/data/bases.shadow'

export const CardBases = {
  ...ChaosBases,
  ...OrderBases,
  ...ShadowBases,
  ...MixedBases,
}
