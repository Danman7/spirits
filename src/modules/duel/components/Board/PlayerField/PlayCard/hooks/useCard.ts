import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'

export const useCard = (cardId: string) => {
  const {
    state: { cards },
  } = useDuel()

  return cards[cardId]
}
