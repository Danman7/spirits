import { FC } from 'react'
import { motion } from 'framer-motion'

import { SlideInOutContentVariants } from 'src/shared/animations'

import { victoryMessage } from 'src/features/duel/messages'

const VictoryModal: FC<{ victorName?: string }> = ({ victorName }) => (
  <motion.h1 variants={SlideInOutContentVariants}>
    {`${victorName} ${victoryMessage}`}
  </motion.h1>
)

export default VictoryModal
