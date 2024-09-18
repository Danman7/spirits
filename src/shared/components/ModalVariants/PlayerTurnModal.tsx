import { FC } from 'react'
import { motion } from 'framer-motion'

import { SlideInOutContentVariants } from 'src/shared/animations'
import { useAppSelector } from 'src/app/store'
import { getPlayerPrespective, getTurn } from 'src/features/duel/selectors'
import { getPlayerTurnModalContent } from 'src/features/duel/utils'

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
