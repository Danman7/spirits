import { FC, useEffect } from 'react'
import { useDuel } from 'src/modules/duel/state/DuelContext'
import { getPlayableCardIds } from 'src/modules/duel/utils'
import { getRandomArrayItem } from 'src/shared/utils'

interface BotControllerProps {
  playerId: string
}

export const BotController: FC<BotControllerProps> = ({ playerId }) => {
  const {
    state: {
      players,
      playerOrder: [activePlayerId],
      phase,
    },
    dispatch,
  } = useDuel()

  const player = players[playerId]
  const { hasPerformedAction } = player

  useEffect(() => {
    if (phase !== 'Redrawing' || hasPerformedAction) return

    dispatch({
      type: 'SKIP_REDRAW',
      playerId,
    })
  }, [playerId, phase, hasPerformedAction, dispatch])

  const isActive = playerId === activePlayerId

  useEffect(() => {
    if (phase !== 'Player Turn' || !isActive || hasPerformedAction) return

    const playableCardIds = getPlayableCardIds(player)

    if (playableCardIds.length) {
      const cardId = getRandomArrayItem(playableCardIds)

      dispatch({
        type: 'PLAY_CARD',
        cardId,
        playerId,
        shouldPay: true,
      })
    } else {
      dispatch({ type: 'RESOLVE_TURN' })
    }
  }, [playerId, hasPerformedAction, isActive, phase, player, dispatch])

  return <></>
}
