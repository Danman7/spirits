import { motion } from 'motion/react'
import { FC } from 'react'
import { LoadingDotsAnimation } from 'src/shared/animations'

const LoadingMessage: FC<{ message: string }> = ({ message }) => (
  <>
    {message}
    <motion.div
      style={{ display: 'inline-block' }}
      animate={LoadingDotsAnimation}
    >
      ...
    </motion.div>
  </>
)

export default LoadingMessage
