import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'
import { CardStack } from 'src/modules/duel/state'

export const useCardIndex = (
  cardId: string,
  playerId: string,
  stack: CardStack,
) => {
  const {
    state: { players },
  } = useDuel()

  return players[playerId][stack].indexOf(cardId)
}
