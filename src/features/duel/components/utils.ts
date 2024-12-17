import { AppDispatch } from 'src/app/store'
import { DuelCard } from 'src/features/cards/types'
import { initializeEndTurn, moveCardToDiscard } from 'src/features/duel/slice'
import { ACTION_TIMEOUT } from 'src/shared/constants'

interface triggerPostCardPlayProps {
  dispatch: AppDispatch
  playerId: string
  card: DuelCard
}

/**
 * A utility that triggers all actions that have to happen after a card is played.
 */
export const triggerPostCardPlay = ({
  dispatch,
  playerId,
  card,
}: triggerPostCardPlayProps) => {
  setTimeout(() => {
    const { type, id } = card

    if (type === 'instant') {
      dispatch(moveCardToDiscard({ cardId: id, playerId }))
    }

    dispatch(initializeEndTurn())
  }, ACTION_TIMEOUT)
}
