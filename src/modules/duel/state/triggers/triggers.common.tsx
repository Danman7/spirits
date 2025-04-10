import type { DuelTrigger, PlayCardAction } from 'src/modules/duel/state'
import {
  generateReduceCounterMessage,
  generateTriggerLogMessage,
} from 'src/modules/duel/state/playLogs'

import { AgentWithCounter, HighPriestMarkander } from 'src/shared/modules/cards'
import { cardNamesThatTriggerTargetingOnPlay } from 'src/shared/modules/cards/data/bases'
import { defaultTheme } from 'src/shared/styles'

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

    const { categories, name } = cards[cardId]

    if (shouldPay && !cardNamesThatTriggerTargetingOnPlay.includes(name))
      dispatch({ type: 'RESOLVE_TURN' })

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

export const handleSelectTargetNoValidTargets: DuelTrigger = {
  predicate: (state, action) =>
    action.type === 'TRIGGER_TARGET_SELECTION' &&
    !state.targeting.validTargets.length,
  effect: ({ dispatch }) => {
    setTimeout(() => {
      dispatch({ type: 'RESOLVE_TURN' })
    }, defaultTheme.transitionTime)
  },
}
