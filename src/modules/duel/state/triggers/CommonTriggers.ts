import { DuelTrigger, PlayCardAction } from 'src/modules/duel/types'
import { ACTION_WAIT_TIMEOUT } from 'src/shared/constants'
import { HighPriestMarkander } from 'src/shared/modules/cards/data/bases'
import { AgentWithCounter } from 'src/shared/modules/cards/types'

export const completeRedraw: DuelTrigger = {
  predicate: (state, action) =>
    (action.type === 'PLAYER_READY' || action.type === 'REDRAW_CARD') &&
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

    const priest = card as AgentWithCounter

    if (categories.includes('Hammerite') && priest.counter > 0) {
      dispatch({
        type: 'UPDATE_AGENT',
        playerId,
        cardId: priestId,
        update: {
          counter: priest.counter - 1,
        },
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
    const currentAttack = attackingQueue[0]

    const defendingPlayerId = currentAttack.defendingPlayerId

    dispatch({
      type: 'AGENT_ATTACK',
      defendingAgentId: currentAttack.defenderId,
      defendingPlayerId,
    })

    setTimeout(() => {
      dispatch({ type: 'MOVE_TO_NEXT_ATTACKER' })
    }, ACTION_WAIT_TIMEOUT)
  },
}
