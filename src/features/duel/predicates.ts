import { Predicate } from 'src/app/listenerMiddleware'
import { playCard } from 'src/features/duel/slice'
import { getOnPlayPredicateForCardBase } from 'src/features/duel/utils'
import {
  BrotherSachelman,
  ElevatedAcolyte,
  HammeriteNovice,
} from 'src/shared/CardBases'

export const HammeriteNoviceOnPlay: Predicate = (
  action,
  currentState,
  previousState,
) =>
  playCard.match(action) &&
  getOnPlayPredicateForCardBase(
    action,
    currentState.duel.players,
    HammeriteNovice,
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
    ElevatedAcolyte,
  )

export const BrotherSachelmanOnPlay: Predicate = (action, currentState) =>
  playCard.match(action) &&
  getOnPlayPredicateForCardBase(
    action,
    currentState.duel.players,
    BrotherSachelman,
  )
