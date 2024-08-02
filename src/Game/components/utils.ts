import {
  playerFirstMessage,
  opponentFirstMessage,
  yourTurnMessage,
  opponentTurnMessage
} from '../messages'

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
