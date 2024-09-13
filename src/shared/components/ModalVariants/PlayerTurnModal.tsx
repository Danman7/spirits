import { FC } from 'react'
import { motion } from 'framer-motion'

import { SlideInOutContentVariants } from 'src/shared/utils/animations'
import { useAppSelector } from 'src/shared/redux/hooks'
import {
  getPlayerPrespective,
  getTurn
} from 'src/shared/redux/selectors/GameSelectors'
import { getPlayerTurnModalContent } from 'src/Game/GameUtils'

const PlayerTurnModal: FC = () => {
  const playerPrespective = useAppSelector(getPlayerPrespective)
  const turn = useAppSelector(getTurn)

  return (
    <>
      <motion.h1 variants={SlideInOutContentVariants}>
        {getPlayerTurnModalContent(playerPrespective.isActive, turn === 1)}
      </motion.h1>
    </>
  )
}

export default PlayerTurnModal
