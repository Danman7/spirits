import { Player } from './types'
import { getPlayableCards } from './utils'
import { getRandomArrayItem } from '../utils/gameUtils'
import { PlayCard } from '../Cards/types'

export const compPlayRandomCard = (
  player: Player,
  onPlayCard: (cardId: PlayCard['id']) => void
) => {
  // check for which cards there is a budget
  const playableCards = getPlayableCards(player)

  if (!playableCards.length) {
    return null
  } else {
    const randomCard = getRandomArrayItem(playableCards) as PlayCard

    onPlayCard(randomCard.id)

    return randomCard
  }
}

export const compPlayTurn = (
  player: Player,
  onPlayCard: (cardId: PlayCard['id']) => void,
  onEndTurn: () => void
) => {
  // for now only play a random card
  compPlayRandomCard(player, onPlayCard)

  onEndTurn()
}
