import { CardStack } from 'src/modules/duel/state'

export const getIsFaceDown = (isOnTop: boolean, stack: CardStack) =>
  isOnTop
    ? ['deck', 'discard', 'hand'].includes(stack)
    : ['deck', 'discard'].includes(stack)

export const getIsSmall = (stack: CardStack) =>
  ['deck', 'discard', 'board'].includes(stack)

export const getCardMargin = (
  stack: CardStack,
  index: number,
  isOnTop: boolean,
) =>
  ['deck', 'discard'].includes(stack)
    ? isOnTop
      ? stack.length - index * 3
      : index * 3
    : 0
