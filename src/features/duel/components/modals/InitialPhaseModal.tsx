import { FC } from 'react'
import { motion } from 'framer-motion'

import { SlideInOutContentVariants } from 'src/shared/animations'

import { useAppSelector } from 'src/app/store'
import {
  getPlayerNames,
  getActivePlayerName,
} from 'src/features/duel/selectors'
import { initialDrawMessage } from 'src/features/duel/messages'

const InitialPhaseModal: FC = () => {
  const playerNames = useAppSelector(getPlayerNames)
  const firstPlayerName = useAppSelector(getActivePlayerName)

  return (
    <div style={{ maxWidth: 350 }}>
      <motion.h1 variants={SlideInOutContentVariants}>
        {`${playerNames[0]} vs ${playerNames[1]}`}
      </motion.h1>
      <motion.p variants={SlideInOutContentVariants}>
        {`${firstPlayerName} ${initialDrawMessage}`}
      </motion.p>
    </div>
  )
}

export default InitialPhaseModal
