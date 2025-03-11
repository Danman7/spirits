import {
  DuelTrigger,
  PlayCardAction,
  UpdateAgentAction,
} from 'src/modules/duel/DuelTypes'
import { getOtherPlayer } from 'src/modules/duel/DuelUtils'
import {
  generateBoostedLogMessage,
  generatePlayedFromTriggerLogMessage,
  generateTriggerLogMessage,
} from 'src/modules/duel/state/DuelLogMessageUtils'
import {
  getNeighboursIndexes,
  getOnPlayCardPredicate,
  getPlayAllCopiesEffect,
} from 'src/modules/duel/state/DuelStateUtils'
import {
  HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
  TEMPLE_GUARD_BOOST,
} from 'src/shared/modules/cards/CardConstants'
import { Agent } from 'src/shared/modules/cards/CardTypes'
import { HighPriestMarkander } from 'src/shared/modules/cards/data/bases'

export const hammeriteNoviceOnPlay: DuelTrigger = {
  predicate: (state, action) =>
    getOnPlayCardPredicate(action, state.players, 'HammeriteNovice') &&
    action.type === 'PLAY_CARD' &&
    !!state.players[action.playerId].board.find(
      (cardId) =>
        cardId !== action.cardId &&
        state.players[action.playerId].cards[cardId].categories.includes(
          'Hammerite',
        ),
    ),
  effect: ({ action, state, dispatch }) =>
    getPlayAllCopiesEffect(action, state.players, 'HammeriteNovice', dispatch),
}

export const elevatedAcolyteOnPlay: DuelTrigger = {
  predicate: (state, action) =>
    getOnPlayCardPredicate(action, state.players, 'ElevatedAcolyte'),
  effect: ({ action, state, dispatch }) => {
    const { cardId, playerId } = action as PlayCardAction
    const { players } = state
    const { board, cards } = players[playerId]
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
        playerId,
        amount: 1,
      })
    }
  },
}

export const templeGuardOnPlay: DuelTrigger = {
  predicate: (state, action) =>
    getOnPlayCardPredicate(action, state.players, 'TempleGuard'),
  effect: ({ action, state, dispatch }) => {
    const { cardId, playerId } = action as PlayCardAction
    const { players, playerOrder } = state
    const player = players[playerId]
    const opponent = getOtherPlayer(players, playerOrder, playerId)
    const matchedCard = player.cards[cardId] as Agent

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
    getOnPlayCardPredicate(action, state.players, 'BrotherSachelman'),
  effect: ({ action, state, dispatch }) => {
    const { cardId: playedCardId, playerId } = action as PlayCardAction
    const { players } = state
    const { board, cards } = players[playerId]

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
    state.players[action.playerId].cards[action.cardId].name ===
      HighPriestMarkander.name,
  effect: ({ action, state, dispatch }) => {
    const { players } = state
    const { cardId, playerId } = action as UpdateAgentAction
    const { cards, board } = players[playerId]
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
