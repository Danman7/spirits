import { AnimationDefinition, AnimationProps, Variants } from 'framer-motion'

export const fadeInAndOut: AnimationProps = {
  animate: {
    opacity: [0, 1, 1, 0]
  },
  transition: { duration: 2.7, times: [0, 0.2, 0.8, 1] }
}

export const slideLeftToRight: AnimationProps = {
  animate: {
    x: [-200, 0, 0, 200],
    opacity: [0, 1, 1, 0]
  },
  transition: { duration: 1.8, delay: 0.2, times: [0, 0.2, 0.8, 1] }
}

export const numberChange: AnimationDefinition = {
  scale: [null, 2],
  color: [null, '#FFD700'],
  transition: {
    repeat: 1,
    repeatType: 'reverse',
    type: 'spring',
    bounce: 0.8
  }
}

export const cardPaperVariants: Variants = {
  faceUp: {
    rotateY: 0
  },
  faceDown: {
    rotateY: 180
  }
}
