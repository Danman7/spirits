import { FC, useEffect } from 'react'
import { getPlayableCardIds, useDuel } from 'src/modules/duel'
import { ACTION_WAIT_TIMEOUT } from 'src/shared/constants'
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
  const isActive = playerId === activePlayerId

  // Pass redrawing automatically (for now)
  useEffect(() => {
    if (phase === 'Redrawing') {
      dispatch({
        type: 'PLAYER_READY',
        playerId,
      })
    }
  }, [phase])

  // Play a random card on turn (for now)
  useEffect(() => {
    if (phase === 'Player Turn' && isActive) {
      setTimeout(() => {
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
      }, ACTION_WAIT_TIMEOUT)
    }
  }, [isActive, phase])

  return <></>
}
