import { AnimationDefinition, Variants } from 'framer-motion'

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

export const ScaleInOutVariants: Variants = {
  open: {
    scale: 1,
    transition: {
      when: 'beforeChildren'
    }
  },
  closed: {
    scale: 0,
    transition: {
      when: 'afterChildren'
    }
  }
}

export const SlideInOutContentVariants: Variants = {
  open: {
    opacity: 1,
    x: ['-100%', 0]
  },
  closed: {
    opacity: 0,
    x: [0, '100%']
  }
}

export const FadeInOutVariants: Variants = {
  open: {
    opacity: 1
  },
  closed: {
    opacity: 0
  }
}
