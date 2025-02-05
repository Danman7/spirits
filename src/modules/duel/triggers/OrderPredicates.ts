import { Predicate } from 'src/app'
import {
  getOnPlayPredicateForCardBase,
  playCard,
  updateAgent,
} from 'src/modules/duel'
import { HighPriestMarkander } from 'src/shared/data'

export const HammeriteNoviceOnPlay: Predicate = (
  action,
  currentState,
  previousState,
) =>
  playCard.match(action) &&
  getOnPlayPredicateForCardBase(
    action,
    currentState.duel.players,
    'HammeriteNovice',
  ) &&
  previousState.duel.players[action.payload.playerId].board.some((cardId) =>
    previousState.duel.players[action.payload.playerId].cards[
      cardId
    ].categories.includes('Hammerite'),
  )

export const ElevatedAcolyteOnPlay: Predicate = (action, currentState) =>
  getOnPlayPredicateForCardBase(
    action,
    currentState.duel.players,
    'ElevatedAcolyte',
  )

export const BrotherSachelmanOnPlay: Predicate = (action, currentState) =>
  getOnPlayPredicateForCardBase(
    action,
    currentState.duel.players,
    'BrotherSachelman',
  )

export const HighPriestMarkanderOnUpdate: Predicate = (
  action,
  currentState,
) => {
  if (updateAgent.match(action)) {
    const { cardId, playerId } = action.payload
    const { players } = currentState.duel
    const { name } = players[playerId].cards[cardId]

    return name === HighPriestMarkander.name
  }

  return false
}
