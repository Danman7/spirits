import { CardEffectPredicate } from 'src/features/cards/types'
import { PlayerCardAction } from 'src/features/duel/types'
import {
  BookOfAsh,
  BrotherSachelman,
  HammeriteNovice,
} from 'src/features/cards/CardPrototypes'
import { DuelActionTypes } from 'src/features/duel/slice'

export const BrotherSachelmanOnPlayPredicate: CardEffectPredicate<
  PlayerCardAction
> = (action, currentState) => {
  if ((action.type as DuelActionTypes) === 'duel/playCard') {
    const { cardId, playerId } = action.payload

    return (
      currentState.duel.players[playerId].cards[cardId].name ===
      BrotherSachelman.name
    )
  }

  return false
}

export const HammeriteNoviceOnPlayPredicate: CardEffectPredicate<
  PlayerCardAction
> = (action, currentState) => {
  if ((action.type as DuelActionTypes) === 'duel/playCard') {
    const { cardId, playerId } = action.payload

    return (
      currentState.duel.players[playerId].cards[cardId].name ===
      HammeriteNovice.name
    )
  }

  return false
}

export const BookOfAshPredicate: CardEffectPredicate<PlayerCardAction> = (
  action,
  currentState,
) => {
  if ((action.type as DuelActionTypes) === 'duel/playCard') {
    const { cardId, playerId } = action.payload

    return (
      currentState.duel.players[playerId].cards[cardId].name === BookOfAsh.name
    )
  }

  return false
}
