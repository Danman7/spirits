import {
  BookOfAsh,
  BrotherSachelman,
  ElevatedAcolyte,
  HammeriteNovice,
} from 'src/features/cards/CardBases'
import { CardEffectPredicate } from 'src/features/cards/types'
import { getOnPlayPredicate } from 'src/shared/utils'
import { PlayerCardAction } from 'src/features/duel/types'

export const BrotherSachelmanOnPlayPredicate: CardEffectPredicate<
  PlayerCardAction
> = (action, currentState) =>
  getOnPlayPredicate(action, currentState, BrotherSachelman.name)

export const HammeriteNoviceOnPlayPredicate: CardEffectPredicate<
  PlayerCardAction
> = (action, currentState) =>
  getOnPlayPredicate(action, currentState, HammeriteNovice.name)

export const BookOfAshPredicate: CardEffectPredicate<PlayerCardAction> = (
  action,
  currentState,
) => getOnPlayPredicate(action, currentState, BookOfAsh.name)

export const ElevatedAcolytePredicate: CardEffectPredicate<PlayerCardAction> = (
  action,
  currentState,
) => getOnPlayPredicate(action, currentState, ElevatedAcolyte.name)
