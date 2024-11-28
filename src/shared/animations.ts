import {
  AnimationDefinition,
  TargetAndTransition,
  Variants,
} from 'motion/react'

/**
 * Takes an inline-block element and reverse loops x and letter spacing to create a loading symbols effect.
 */
export const LoadingDotsAnimation: TargetAndTransition = {
  x: [0, 10],
  color: [null, 'var(--primary-color)'],
  letterSpacing: ['0.5px', '4px'],
  transition: {
    duration: 1,
    repeat: Infinity,
    repeatType: 'reverse',
  },
}

/**
 * Pulsates scale and color for when the user needs to notice a number that has been changed.
 */
export const NumberChangeAnimation: TargetAndTransition = {
  scale: [null, 1.4],
  color: [null, 'var(--hilight-color)'],
  transition: {
    repeat: 1,
    repeatType: 'reverse',
  },
}

/**
 * Pulsates scale and box-shadow for the purpose of showing a card has been boosted.
 */
export const CardBoostAnimation: AnimationDefinition = {
  scale: [1, 1.1],
  boxShadow: [null, '0 0 5px 5px var(--hilight-color)'],
  transition: {
    repeat: 1,
    repeatType: 'reverse',
  },
}

/**
 * Shakes x position for the purpose of showing a card has been damaged.
 */
export const CardDamageAnimation: AnimationDefinition = {
  x: [null, 10, 0, -10, 0],
  transition: {
    repeat: 2,
    repeatType: 'reverse',
    duration: 0.1,
  },
}

/**
 * Variants for sliding an element from the left and out to the left. Main purpose is to animate the side panel.
 */
export const SlideLeftVariants: Variants = {
  open: {
    opacity: 1,
    x: [-320, 0],
  },
  closed: {
    opacity: 0,
    x: [0, -320],
  },
}

/**
 * Method for getting the proper card attack animation based on weather card in on top field or bottom one.
 */
export const getCardAttackAnimation = (
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
