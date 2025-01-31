export * from 'src/modules/duel/slice'
export * from 'src/modules/duel/selectors'
export * from 'src/modules/duel/types'
export * from 'src/modules/duel/utils'
export * from 'src/modules/duel/constants'
export * from 'src/modules/duel/messages'

import * as OrderEffects from 'src/modules/duel/triggers/OrderEffects'
import * as CommonEffects from 'src/modules/duel/triggers/CommonEffects'
import * as OrderPredicates from 'src/modules/duel/triggers/OrderPredicates'
import * as CommonPredicates from 'src/modules/duel/triggers/CommonPredicates'

export const Effects = {
  ...OrderEffects,
  ...CommonEffects,
}

export const Predicates = {
  ...OrderPredicates,
  ...CommonPredicates,
}

export type PredicatesName = keyof typeof Predicates
type EffectName = keyof typeof Effects

export const PredicatesMap: {
  [key in PredicatesName]: EffectName
} = {
  OnPlay: 'HandlePostPlay',
  BrotherSachelmanOnPlay: 'BoostAlliedHammeritesWithLowerStrength',
  HammeriteNoviceOnPlay: 'PlayAllHammeriteNoviceCopies',
  ElevatedAcolyteOnPlay: 'DamageSelfIfNotNextToHigherPowerHammerite',
}
