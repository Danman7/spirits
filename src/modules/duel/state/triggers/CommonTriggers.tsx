import { PlayCardAction } from 'src/modules/duel/state/duelActionTypes'
import { DuelTrigger } from 'src/modules/duel/state/duelStateTypes'
import {
  generateReduceCounterMessage,
  generateTriggerLogMessage,
} from 'src/modules/duel/state/logMessageUtils'
import { AgentWithCounter } from 'src/shared/modules/cards/CardTypes'
import { HighPriestMarkander } from 'src/shared/modules/cards/data/bases'
import { defaultTheme } from 'src/shared/styles/DefaultTheme'

export const completeRedraw: DuelTrigger = {
  predicate: (state, action) =>
    (action.type === 'SKIP_REDRAW' || action.type === 'REDRAW_CARD') &&
    state.phase === 'Redrawing' &&
    Object.values(state.players).every(
      ({ hasPerformedAction }) => !!hasPerformedAction,
    ),
  effect: ({ dispatch }) => dispatch({ type: 'COMPLETE_REDRAW' }),
}

export const advanceTurn: DuelTrigger = {
  predicate: (state, action) =>
    action.type === 'MOVE_TO_NEXT_ATTACKER' && !state.attackingQueue.length,
  effect: ({ dispatch }) => dispatch({ type: 'ADVANCE_TURN' }),
}

export const handlePostPlayCard: DuelTrigger = {
  predicate: (_, action) => action.type === 'PLAY_CARD',
  effect: ({ state, action, dispatch }) => {
    const { cards } = state
    const { shouldPay, cardId, playerId } = action as PlayCardAction

    if (shouldPay) dispatch({ type: 'RESOLVE_TURN' })

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
        update: {
          counter: counter - 1,
        },
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

export const handleAttack: DuelTrigger = {
  predicate: (state, action) =>
    (action.type === 'MOVE_TO_NEXT_ATTACKER' ||
      action.type === 'RESOLVE_TURN') &&
    !!state.attackingQueue.length,
  effect: ({ state, dispatch }) => {
    const { attackingQueue } = state
    const { defenderId, defendingPlayerId } = attackingQueue[0]

    dispatch({
      type: 'AGENT_ATTACK',
      defendingAgentId: defenderId,
      defendingPlayerId,
    })

    setTimeout(() => {
      dispatch({ type: 'MOVE_TO_NEXT_ATTACKER' })
    }, defaultTheme.transitionTime)
  },
}
