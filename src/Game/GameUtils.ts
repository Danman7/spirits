import { CardState } from '../Cards/CardTypes'
import {
  playerFirstMessage,
  opponentFirstMessage,
  yourTurnMessage,
  opponentTurnMessage
} from './messages'
import { GameState, Player } from './GameTypes'

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
  player.cards.filter(
    card => card.state === CardState.InHand && card.cost <= player.coins
  )

export const getCardsInHand = (player: Player) =>
  player.cards.filter(card => card.state === CardState.InHand)

export const getCardsOnBoard = (player: Player) =>
  player.cards.filter(card => card.state === CardState.OnBoard)

export const getAllCardsOnBoard = (state: GameState) =>
  [...state.topPlayer.cards, ...state.bottomPlayer.cards].filter(
    card => card.state === CardState.OnBoard
  )
