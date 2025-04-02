import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'

export const useIsAttacking = (cardId: string) => {
  const {
    state: { attackingQueue },
  } = useDuel()

  return cardId === attackingQueue[0]?.attackerId
}
