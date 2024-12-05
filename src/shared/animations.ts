import { AnimationDefinition } from 'motion/react'

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
