import { CardEffectPredicate } from 'src/features/cards/types'
import { PlayerCardAction } from 'src/features/duel/types'
import { BrotherSachelman, HammeriteNovice } from './CardPrototypes'

export const BrotherSachelmanOnPlayPredicate: CardEffectPredicate<
  PlayerCardAction
> = (action, currentState) => {
  if (action.type === 'duel/playCardFromHand') {
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
  if (action.type === 'duel/playCardFromHand') {
    const { cardId, playerId } = action.payload

    return (
      currentState.duel.players[playerId].cards[cardId].name ===
      HammeriteNovice.name
    )
  }

  return false
}
