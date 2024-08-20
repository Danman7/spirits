import { Player } from './GameTypes'
import { getPlayableCards } from './GameUtils'
import { getRandomArrayItem } from '../utils/utils'
import { PlayCard } from '../Cards/CardTypes'

export const compPlayRandomCard = (
  player: Player,
  onPlayCard: (cardId: PlayCard) => void
) => {
  // check for which cards there is a budget
  const playableCards = getPlayableCards(player)

  if (!playableCards.length) {
    return null
  } else {
    const randomCard = getRandomArrayItem(playableCards) as PlayCard

    onPlayCard(randomCard)

    return randomCard
  }
}

export const compPlayTurn = (
  player: Player,
  onPlayCard: (cardId: PlayCard) => void,
  onEndTurn: () => void
) => {
  // for now only play a random card
  compPlayRandomCard(player, onPlayCard)

  onEndTurn()
}
