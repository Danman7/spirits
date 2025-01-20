import { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import {
  getActivePlayerId,
  getPhase,
  getPlayers,
} from 'src/features/duel/selectors'
import { completeRedraw, playCard, resolveTurn } from 'src/features/duel/slice'
import {
  getPlayableCardIds,
  triggerPostCardPlay,
} from 'src/features/duel/utils'
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
  const { cards } = player
  const isActive = playerId === activePlayerId

  // Pass redrawing automatically (for now)
  useEffect(() => {
    if (phase === 'Redrawing') {
      dispatch(completeRedraw(playerId))
    }
  }, [playerId, phase, dispatch])

  // Play a random card on turn (for now)
  useEffect(() => {
    if (phase === 'Player Turn' && isActive) {
      const playableCardIds = getPlayableCardIds(player)

      if (playableCardIds.length) {
        const cardId = getRandomArrayItem(playableCardIds)

        dispatch(
          playCard({
            cardId,
            playerId,
          }),
        )

        triggerPostCardPlay({
          card: cards[cardId],
          playerId,
          dispatch,
        })
      } else {
        dispatch(resolveTurn())
      }
    }
  }, [cards, playerId, isActive, phase, player, dispatch])

  return <></>
}
