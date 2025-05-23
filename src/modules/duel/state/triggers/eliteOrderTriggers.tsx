import {
  DuelTrigger,
  PlayCardAction,
  UpdateAgentAction,
  getOnPlayCardPredicate,
} from 'src/modules/duel/state'
import {
  generateBoostedLogMessage,
  generatePlayedFromTriggerLogMessage,
  generateReduceCounterMessage,
  generateTriggerLogMessage,
} from 'src/modules/duel/state/playLogs'

import {
  Agent,
  AgentWithCounter,
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

export const highPriestMarkanderOnPlayCard: DuelTrigger = {
  predicate: (_, action) => action.type === 'PLAY_CARD',
  effect: ({ state, action, dispatch }) => {
    const { cards } = state
    const { cardId, playerId } = action as PlayCardAction

    const { categories } = cards[cardId]

    const HighPriest = Object.entries(cards).find(
      ([, card]) => card.name === HighPriestMarkander.name,
    )

    if (!HighPriest) return

    const [priestId, card] = HighPriest

    const { counter } = card as AgentWithCounter

    if (categories.includes('Hammerite') && counter > 0) {
      dispatch({
        type: 'UPDATE_AGENT',
        playerId,
        cardId: priestId,
        update: { counter: counter - 1 },
      })

      dispatch({
        type: 'ADD_LOG',
        message: generateTriggerLogMessage(
          generateReduceCounterMessage(card as AgentWithCounter),
        ),
      })
    }
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
