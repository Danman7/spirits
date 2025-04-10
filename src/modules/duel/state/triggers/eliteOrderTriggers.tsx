import {
  DuelTrigger,
  PlayCardAction,
  UpdateAgentAction,
  getOnPlayCardPredicate,
} from 'src/modules/duel/state'
import {
  generateBoostedLogMessage,
  generatePlayedFromTriggerLogMessage,
  generateTriggerLogMessage,
} from 'src/modules/duel/state/playLogs'

import {
  Agent,
  HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
  HighPriestMarkander,
} from 'src/shared/modules/cards'

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
          update: { strength: strength + HAMMERITES_WITH_LOWER_STRENGTH_BOOST },
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
    const { board, discard } = players[playerId]
    const { counter } = cards[cardId] as Agent

    if ((counter as number) <= 0 && ![...board, ...discard].includes(cardId)) {
      dispatch({ type: 'PLAY_CARD', cardId, playerId, shouldPay: false })

      dispatch({
        type: 'ADD_LOG',
        message: generateTriggerLogMessage(
          generatePlayedFromTriggerLogMessage(HighPriestMarkander.name),
        ),
      })
    }
  },
}
