import { FC } from 'react'
import { motion } from 'framer-motion'

import { SlideInOutContentVariants } from 'src/shared/animations'

import { useAppSelector } from 'src/app/store'
import { getPlayers, getPlayerOrder } from 'src/features/duel/selectors'
import { initialDrawMessage } from 'src/features/duel/messages'

const InitialPhaseModal: FC = () => {
  const players = useAppSelector(getPlayers)
  const playerOrder = useAppSelector(getPlayerOrder)

  return (
    <>
      <motion.h1 variants={SlideInOutContentVariants}>
        {`${players[playerOrder[0]].name} vs ${players[playerOrder[1]].name}`}
      </motion.h1>
      <motion.div variants={SlideInOutContentVariants}>
        {initialDrawMessage}
      </motion.div>
    </>
  )
}

export default InitialPhaseModal
