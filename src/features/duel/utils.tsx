import {
  playerFirstMessage,
  opponentFirstMessage,
  yourTurnMessage,
  opponentTurnMessage
} from 'src/features/duel/messages'
import { DuelState, Player } from 'src/features/duel/types'

import { PlayCard } from 'src/features/cards/types'

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

export const normalizeArrayOfPlayers = (players: Player[]) =>
  players.reduce((statePlayers: DuelState['players'], player) => {
    statePlayers[player.id] = player

    return statePlayers
  }, {})

export const normalizeArrayOfCards = (cards: PlayCard[]): Player['cards'] =>
  cards.reduce((playerCards: Player['cards'], cards) => {
    playerCards[cards.id] = cards

    return playerCards
  }, {})

export const initializeCardsAndDeck = (
  cards: PlayCard[]
): { cards: Player['cards']; deck: Player['deck'] } => ({
  cards: normalizeArrayOfCards(cards),
  deck: cards.map(({ id }) => id)
})
