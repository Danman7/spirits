import { FC } from 'react'
import { StyledOverlay } from './GameStyles'
import { useSelector } from 'react-redux'
import {
  getActivePlayerId,
  getBottomPlayer,
  getGameTurn
} from '../GameSelectors'
import { getOverlayMessage } from '../GameUtils'

export interface OverlayProps {
  isAnimated?: boolean
}

export const Overlay: FC<OverlayProps> = ({ isAnimated = true }) => {
  const bottomPlayer = useSelector(getBottomPlayer)
  const activePlayerId = useSelector(getActivePlayerId)
  const turn = useSelector(getGameTurn)

  const isPlayerTurn = bottomPlayer?.id === activePlayerId
  const isFirstTurn = turn === 1

  const message = getOverlayMessage(isPlayerTurn, isFirstTurn)

  return (
    <StyledOverlay $isAnimated={isAnimated}>
      <h1>{message}</h1>
    </StyledOverlay>
  )
}
