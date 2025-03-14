import { getOtherPlayer } from 'src/modules/duel/duelUtils'
import {
  generateBoostedLogMessage,
  generatePlayedFromTriggerLogMessage,
  generateTriggerLogMessage,
} from 'src/modules/duel/state/logMessageUtils'
import {
  getNeighboursIndexes,
  getOnPlayCardPredicate,
  getPlayAllCopiesEffect,
} from 'src/modules/duel/state/duelStateUtils'
import {
  HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
  TEMPLE_GUARD_BOOST,
} from 'src/shared/modules/cards/CardConstants'
import { Agent } from 'src/shared/modules/cards/CardTypes'
import { HighPriestMarkander } from 'src/shared/modules/cards/data/bases'
import { DuelTrigger } from 'src/modules/duel/state/duelStateTypes'
import {
  PlayCardAction,
  UpdateAgentAction,
} from 'src/modules/duel/state/duelActionTypes'

export const hammeriteNoviceOnPlay: DuelTrigger = {
  predicate: (state, action) =>
    getOnPlayCardPredicate(action, state.cards, 'HammeriteNovice') &&
    action.type === 'PLAY_CARD' &&
    !!state.players[action.playerId].board.find(
      (cardId) =>
        cardId !== action.cardId &&
        state.cards[cardId].categories.includes('Hammerite'),
    ),
  effect: ({ action, state, dispatch }) =>
    getPlayAllCopiesEffect(
      action,
      state.players,
      state.cards,
      'HammeriteNovice',
      dispatch,
    ),
}

export const elevatedAcolyteOnPlay: DuelTrigger = {
  predicate: (state, action) =>
    getOnPlayCardPredicate(action, state.cards, 'ElevatedAcolyte'),
  effect: ({ action, state, dispatch }) => {
    const { cardId, playerId } = action as PlayCardAction
    const { players, cards } = state
    const { board } = players[playerId]
    const matchedCard = cards[cardId] as Agent

    const playerdCardIndex = board.indexOf(cardId)
    const neighbourIndexed = getNeighboursIndexes(playerdCardIndex, board)

    if (
      !neighbourIndexed.some((neighbourIndex) => {
        const card = cards[board[neighbourIndex]] as Agent
        const { categories, strength } = card

        return (
          card &&
          categories.includes('Hammerite') &&
          strength > matchedCard.strength
        )
      })
    ) {
      dispatch({
        type: 'AGENT_DAMAGE_SELF',
        cardId,
        amount: 1,
      })
    }
  },
}

export const templeGuardOnPlay: DuelTrigger = {
  predicate: (state, action) =>
    getOnPlayCardPredicate(action, state.cards, 'TempleGuard'),
  effect: ({ action, state, dispatch }) => {
    const { cardId, playerId } = action as PlayCardAction
    const { players, playerOrder, cards } = state
    const player = players[playerId]
    const opponent = getOtherPlayer(players, playerOrder, playerId)
    const matchedCard = cards[cardId] as Agent

    if (opponent.board.length <= player.board.length) return

    dispatch({
      type: 'UPDATE_AGENT',
      cardId,
      playerId,
      update: {
        strength: matchedCard.strength + TEMPLE_GUARD_BOOST,
      },
    })

    dispatch({
      type: 'ADD_LOG',
      message: generateTriggerLogMessage(
        generateBoostedLogMessage(matchedCard.name, TEMPLE_GUARD_BOOST),
      ),
    })
  },
}

export const brotherSachelmanOnPlay: DuelTrigger = {
  predicate: (state, action) =>
    getOnPlayCardPredicate(action, state.cards, 'BrotherSachelman'),
  effect: ({ action, state, dispatch }) => {
    const { cardId: playedCardId, playerId } = action as PlayCardAction
    const { players, cards } = state
    const { board } = players[playerId]

    board.forEach((boardCardId) => {
      const { strength, categories, name } = cards[boardCardId] as Agent

      if (
        categories.includes('Hammerite') &&
        boardCardId !== playedCardId &&
        strength < (cards[playedCardId] as Agent).strength
      ) {
        dispatch({
          type: 'UPDATE_AGENT',
          cardId: boardCardId,
          playerId,
          update: {
            strength: strength + HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
          },
        })

        dispatch({
          type: 'ADD_LOG',
          message: generateTriggerLogMessage(
            generateBoostedLogMessage(
              name,
              HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
            ),
          ),
        })
      }
    })
  },
}

export const highPriestMarkanderOnUpdate: DuelTrigger = {
  predicate: (state, action) =>
    action.type === 'UPDATE_AGENT' &&
    state.cards[action.cardId].name === HighPriestMarkander.name,
  effect: ({ action, state, dispatch }) => {
    const { players, cards } = state
    const { cardId, playerId } = action as UpdateAgentAction
    const { board } = players[playerId]
    const { counter } = cards[cardId] as Agent

    if ((counter as number) <= 0 && !board.includes(cardId)) {
      dispatch({
        type: 'PLAY_CARD',
        cardId,
        playerId,
        shouldPay: false,
      })

      dispatch({
        type: 'ADD_LOG',
        message: generateTriggerLogMessage(
          generatePlayedFromTriggerLogMessage(HighPriestMarkander.name),
        ),
      })
    }
  },
}
