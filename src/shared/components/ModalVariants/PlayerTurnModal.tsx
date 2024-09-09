import { FC } from 'react'
import { motion } from 'framer-motion'

import { SlideInOutContentVariants } from 'src/shared/utils/animations'
import { useAppSelector } from 'src/shared/redux/hooks'
import {
  getActivePlayer,
  getLoggedInPlayerId,
  getTurn
} from 'src/shared/redux/selectors/GameSelectors'
import { getPlayerTurnModalContent } from 'src/Game/GameUtils'

const PlayerTurnModal: FC = () => {
  const activePlayer = useAppSelector(getActivePlayer)
  const loggedInPlayerId = useAppSelector(getLoggedInPlayerId)
  const turn = useAppSelector(getTurn)

  return (
    <>
      <motion.h1 variants={SlideInOutContentVariants}>
        {getPlayerTurnModalContent(
          activePlayer?.id === loggedInPlayerId,
          turn === 1
        )}
      </motion.h1>
    </>
  )
}

export default PlayerTurnModal
