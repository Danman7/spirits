import { StackConfiguration } from 'src/modules/duel/components/duelComponentTypes'
import {
  PlayerBoard,
  PlayerDeck,
  PlayerDiscard,
  PlayerHand,
} from 'src/modules/duel/components/PlayerField/PlayerFieldStyles'
import { CardStack } from 'src/modules/duel/state/duelStateTypes'

export const getStackConfiguration = (
  stack: CardStack,
  isOnTop: boolean,
  browseStack: (stack: CardStack) => void,
): StackConfiguration => {
  const stackConfigs: Record<CardStack, StackConfiguration> = {
    board: { component: PlayerBoard },
    deck: {
      component: PlayerDeck,
      onClickStack: !isOnTop ? () => browseStack(stack) : undefined,
    },
    discard: {
      component: PlayerDiscard,
      onClickStack: !isOnTop ? () => browseStack(stack) : undefined,
    },
    hand: { component: PlayerHand },
  }

  return stackConfigs[stack]
}
