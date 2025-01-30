import { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import {
  getActivePlayerId,
  getPhase,
  getPlayers,
} from 'src/modules/duel/selectors'
import { completeRedraw, playCard, resolveTurn } from 'src/modules/duel/slice'
import { getPlayableCardIds } from 'src/modules/duel/utils'
import { ACTION_WAIT_TIMEOUT } from 'src/shared/constants'
import { getRandomArrayItem } from 'src/shared/utils'

interface BotControllerProps {
  playerId: string
}

export const BotController: FC<BotControllerProps> = ({ playerId }) => {
  const dispatch = useAppDispatch()
  const phase = useAppSelector(getPhase)
  const players = useAppSelector(getPlayers)
  const activePlayerId = useAppSelector(getActivePlayerId)

  const player = players[playerId]
  const isActive = playerId === activePlayerId

  // Pass redrawing automatically (for now)
  useEffect(() => {
    if (phase === 'Redrawing') {
      dispatch(completeRedraw(playerId))
    }
  }, [phase])

  // Play a random card on turn (for now)
  useEffect(() => {
    if (phase === 'Player Turn' && isActive) {
      setTimeout(() => {
        const playableCardIds = getPlayableCardIds(player)

        if (playableCardIds.length) {
          const cardId = getRandomArrayItem(playableCardIds)

          dispatch(
            playCard({
              cardId,
              playerId,
              shouldPay: true,
            }),
          )
        } else {
          dispatch(resolveTurn())
        }
      }, ACTION_WAIT_TIMEOUT)
    }
  }, [isActive, phase])

  return <></>
}
