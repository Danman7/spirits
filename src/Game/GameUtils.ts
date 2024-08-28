import {
  playerFirstMessage,
  opponentFirstMessage,
  yourTurnMessage,
  opponentTurnMessage,
  passButtonMessage,
  endTurnMessage
} from 'src/Game/messages'
import { GamePhase, Player } from 'src/shared/redux/StateTypes'

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

interface GetPlayerButtonTextProps {
  phase: GamePhase
  hasActivePlayerPlayedACardThisTurn?: boolean
  isPlayerPrespectiveTurn?: boolean
}

export const getPlayerButtonText = ({
  phase,
  hasActivePlayerPlayedACardThisTurn,
  isPlayerPrespectiveTurn
}: GetPlayerButtonTextProps) => {
  console.log(phase)
  if (
    phase === GamePhase.PLAYER_TURN &&
    isPlayerPrespectiveTurn &&
    !hasActivePlayerPlayedACardThisTurn
  ) {
    return passButtonMessage
  }

  if (
    phase === GamePhase.PLAYER_TURN &&
    isPlayerPrespectiveTurn &&
    hasActivePlayerPlayedACardThisTurn
  ) {
    return endTurnMessage
  }

  return ''
}

export const getPlayableCards = (player: Player) =>
  player.hand.filter(card => card.cost <= player.coins)
