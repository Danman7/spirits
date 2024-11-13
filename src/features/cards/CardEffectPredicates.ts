import {
  BookOfAsh,
  BrotherSachelman,
  HammeriteNovice,
} from 'src/features/cards/CardBases'
import { CardEffectPredicate } from 'src/features/cards/types'
import { getOnPlayPredicate } from 'src/features/cards/utils'
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
