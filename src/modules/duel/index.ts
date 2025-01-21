import * as OrderEffects from 'src/modules/duel/triggers/OrderEffects'
import * as OrderPredicates from 'src/modules/duel/triggers/OrderPredicates'

export const Effects = {
  ...OrderEffects,
}

export const Predicates = {
  ...OrderPredicates,
}

export type PredicatesName = keyof typeof Predicates
type EffectName = keyof typeof Effects

export const PredicatesMap: {
  [key in PredicatesName]: EffectName
} = {
  BrotherSachelmanOnPlay: 'BoostAlliedHammeritesWithLowerStrength',
  HammeriteNoviceOnPlay: 'PlayAllHammeriteNoviceCopies',
  ElevatedAcolyteOnPlay: 'DamageSelfIfNotNextToHigherPowerHammerite',
}
