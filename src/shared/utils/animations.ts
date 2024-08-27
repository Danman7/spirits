import { AnimationDefinition, AnimationProps, Variants } from 'framer-motion'

export const FadeInAndOutAnimation: AnimationProps = {
  animate: {
    opacity: [0, 1, 1, 0]
  },
  transition: { duration: 2.7, times: [0, 0.2, 0.8, 1] }
}

export const SlideLeftToRightAnimation: AnimationProps = {
  animate: {
    x: [-200, 0, 0, 200],
    opacity: [0, 1, 1, 0]
  },
  transition: { duration: 1.8, delay: 0.2, times: [0, 0.2, 0.8, 1] }
}

export const NumberChangeAnimation: AnimationDefinition = {
  scale: [null, 1.4],
  color: [null, 'var(--hilight-color)'],
  transition: {
    repeat: 1,
    repeatType: 'reverse'
  }
}

export const CardBoostAnimation: AnimationDefinition = {
  scale: [null, 1.1],
  boxShadow: [null, `0 0 4px 4px var(--hilight-color)`],
  transition: {
    repeat: 1,
    repeatType: 'reverse'
  }
}

export const CardPaperVariants: Variants = {
  faceUp: {
    rotateY: 0
  },
  faceDown: {
    rotateY: 180
  }
}
