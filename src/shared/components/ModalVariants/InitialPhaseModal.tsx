import { FC } from 'react'
import { motion } from 'framer-motion'

import { initialDrawMessage } from 'src/Game/messages'
import { SlideInOutContentVariants } from 'src/shared/utils/animations'
import { useAppSelector } from 'src/shared/redux/hooks'
import {
  getPlayerOrder,
  getPlayers
} from 'src/shared/redux/selectors/GameSelectors'

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
