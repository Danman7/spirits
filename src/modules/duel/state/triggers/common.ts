import { DuelAction, DuelTrigger } from 'src/modules/duel/types'
import { HighPriestMarkander } from 'src/shared/data'
import { AgentWithCounter } from 'src/shared/types'

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
  effect: ({ state, action, dispatch, setLastAction }) => {
    if (action.type !== 'PLAY_CARD') return

    const { players } = state
    const { shouldPay, cardId, playerId } = action

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
      const action: DuelAction = {
        type: 'UPDATE_AGENT',
        playerId,
        cardId: priestId,
        update: {
          counter: priest.counter - 1,
        },
      }

      dispatch(action)

      setLastAction(action)
    }
  },
}
