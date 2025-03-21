import { CardStack } from 'src/modules/duel/state/duelStateTypes'

export const getIsFaceDown = (isOnTop: boolean, stack: CardStack) =>
  isOnTop
    ? ['deck', 'discard', 'hand'].includes(stack)
    : ['deck', 'discard'].includes(stack)

export const getIsSmall = (stack: CardStack) =>
  ['deck', 'discard', 'board'].includes(stack)
