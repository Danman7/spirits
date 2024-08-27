import {
  playerFirstMessage,
  opponentFirstMessage,
  yourTurnMessage,
  opponentTurnMessage
} from 'src/Game/messages'
import { Player } from 'src/shared/redux/StateTypes'

export const getOverlayMessage = (
  isPlayerTurn: boolean,
  isFirstTurn: boolean
): string => {
  if (isPlayerTurn && isFirstTurn) {
    return playerFirstMessage
  }

  if (!isPlayerTurn && isFirstTurn) {
    return opponentFirstMessage
  }

  if (isPlayerTurn && !isFirstTurn) {
    return yourTurnMessage
  }

  return opponentTurnMessage
}

export const getPlayableCards = (player: Player) =>
  player.hand.filter(card => card.cost <= player.coins)
