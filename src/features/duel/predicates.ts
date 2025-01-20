import { Predicate } from 'src/app/listenerMiddleware'
import { playCard } from 'src/features/duel/slice'
import { getOnPlayPredicateForCardBase } from 'src/features/duel/utils'
import { HammeriteNovice } from 'src/shared/CardBases'

export const HammeriteNoviceOnPlay: Predicate = (action, _, previousState) => {
  if (playCard.match(action)) {
    const { playerId } = action.payload
    const { players } = previousState.duel
    const { cards, board } = players[playerId]

    return (
      getOnPlayPredicateForCardBase(action, cards, HammeriteNovice) &&
      board.some((cardId) => cards[cardId].categories.includes('Hammerite'))
    )
  }

  return false
}
