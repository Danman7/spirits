import {
  playerFirstMessage,
  opponentFirstMessage,
  yourTurnMessage,
  opponentTurnMessage
} from 'src/Game/messages'
import { Player } from 'src/shared/redux/StateTypes'

export const getPlayerTurnModalContent = (
  isPlayerPrespective: boolean,
  isFirstTurn: boolean
): string => {
  if (isPlayerPrespective && isFirstTurn) {
    return playerFirstMessage
  }

  if (!isPlayerPrespective && isFirstTurn) {
    return opponentFirstMessage
  }

  if (isPlayerPrespective && !isFirstTurn) {
    return yourTurnMessage
  }

  return opponentTurnMessage
}

export const getPlayableCardIds = (player: Player) =>
  player.hand.filter(cardId => player.cards[cardId].cost <= player.coins)
