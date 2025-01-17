import { FC, useEffect } from 'react'

import { useAppDispatch, useAppSelector } from 'src/app/store'
import { getPhase } from 'src/features/duel/selectors'
import { completeRedraw, playCard } from 'src/features/duel/slice'
import { Player } from 'src/features/duel/types'
import {
  getPlayableCardIds,
  triggerPostCardPlay,
} from 'src/features/duel/utils'
import { getRandomArrayItem } from 'src/shared/utils'

interface BotControllerProps {
  player: Player
  isActive: boolean
}

export const BotController: FC<BotControllerProps> = ({ player, isActive }) => {
  const { id: playerId, cards } = player

  const dispatch = useAppDispatch()
  const phase = useAppSelector(getPhase)

  useEffect(() => {
    if (phase === 'Redrawing') {
      dispatch(completeRedraw(playerId))
    }
  }, [playerId, phase, dispatch])

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
      }
    }
  }, [cards, playerId, isActive, phase, player, dispatch])

  return <></>
}
