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
    x: [-50, 0]
  },
  closed: {
    opacity: 0,
    x: [0, 50]
  }
}

export const FadeInOutVariants: Variants = {
  open: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.3
    }
  },
  closed: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.3
    }
  }
}
