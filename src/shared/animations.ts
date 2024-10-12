import {
  AnimationDefinition,
  TargetAndTransition,
  Variants,
} from 'framer-motion'

export const NumberChangeAnimation: TargetAndTransition = {
  scale: [null, 1.4],
  color: [null, 'var(--hilight-color)'],
  transition: {
    repeat: 1,
    repeatType: 'reverse',
  },
}

export const CardBoostAnimation: AnimationDefinition = {
  scale: [1, 1.1],
  boxShadow: [null, '0 0 5px 5px var(--hilight-color)'],
  transition: {
    repeat: 1,
    repeatType: 'reverse',
  },
}

export const CardAttackAnimation = (
  isOnTop?: boolean,
): AnimationDefinition => ({
  y: [null, isOnTop ? 20 : -20],
  boxShadow: [
    null,
    isOnTop
      ? '0 -1px 1px 1px var(--primary-color)'
      : '0 1px 1px 1px var(--primary-color)',
  ],
  transition: {
    repeat: 1,
    repeatType: 'reverse',
  },
})

export const CardDamageAnimation: AnimationDefinition = {
  x: [null, 10, 0, -10, 0],
  transition: {
    repeat: 2,
    repeatType: 'reverse',
    duration: 0.1,
  },
}

export const FadeInOutVariants: Variants = {
  open: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.3,
    },
  },
  closed: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.3,
    },
  },
}

export const SlideInOutContentVariants: Variants = {
  open: {
    opacity: 1,
    x: [-50, 0],
  },
  closed: {
    opacity: 0,
    x: [0, 50],
  },
}
