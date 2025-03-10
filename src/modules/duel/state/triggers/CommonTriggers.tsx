import { DuelTrigger, PlayCardAction } from 'src/modules/duel/DuelTypes'
import { ACTION_WAIT_TIMEOUT } from 'src/shared/SharedConstants'
import { HighPriestMarkander } from 'src/shared/modules/cards/data/bases'
import { AgentWithCounter } from 'src/shared/modules/cards/CardTypes'
import { reduceCounterLogMessage } from 'src/modules/duel/state/DuelStateMessages'

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
    const { players } = state
    const { shouldPay, cardId, playerId } = action as PlayCardAction

    if (shouldPay) dispatch({ type: 'RESOLVE_TURN' })

    const { cards } = players[playerId]
    const { categories } = cards[cardId]

    const HighPriest = Object.entries(cards).find(
      ([, card]) => card.name === HighPriestMarkander.name,
    )

    if (!HighPriest) return

    const [priestId, card] = HighPriest

    const { counter, name } = card as AgentWithCounter

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
        message: (
          <p>
            <strong>{name}</strong>
            {reduceCounterLogMessage}
            {counter - 1}
          </p>
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
    }, ACTION_WAIT_TIMEOUT)
  },
}
