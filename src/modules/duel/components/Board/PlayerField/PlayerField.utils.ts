import {
  PlayerBoard,
  PlayerDeck,
  PlayerDiscard,
  PlayerHand,
} from 'src/modules/duel/components/Board/PlayerField/PlayerField.styles'
import type { StackConfiguration } from 'src/modules/duel/components/Board/PlayerField/PlayerField.types'
import type { CardStack } from 'src/modules/duel/state'

export const getStackConfiguration = (
  stack: CardStack,
  isOnTop: boolean,
  browseStack: (stack: CardStack) => void,
): StackConfiguration => {
  const stackConfigs: Record<CardStack, StackConfiguration> = {
    board: { component: PlayerBoard },
    deck: {
      component: PlayerDeck,
      showStackCount: true,
      onClickStack: !isOnTop ? () => browseStack(stack) : undefined,
    },
    discard: {
      component: PlayerDiscard,
      showStackCount: true,
      onClickStack: !isOnTop ? () => browseStack(stack) : undefined,
    },
    hand: { component: PlayerHand },
  }

  return stackConfigs[stack]
}
