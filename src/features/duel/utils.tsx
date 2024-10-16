import { DuelState, Player, PlayerCardAction } from 'src/features/duel/types'

import { PlayCard } from 'src/features/cards/types'

export const getPlayableCardIds = (player: Player) =>
  player.hand.filter((cardId) => player.cards[cardId].cost <= player.coins)

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
  cards: PlayCard[],
): { cards: Player['cards']; deck: Player['deck'] } => ({
  cards: normalizeArrayOfCards(cards),
  deck: cards.map(({ id }) => id),
})

export const moveCardToBoardTransformer = (
  state: DuelState,
  action: PlayerCardAction,
) => {
  const { cardId: playedCardId, playerId } = action.payload
  const { players } = state

  const playedCard = players[playerId].cards[playedCardId]

  players[playerId].hasPlayedCardThisTurn = true
  players[playerId].deck = players[playerId].deck.filter(
    (cardId) => cardId !== playedCardId,
  )
  players[playerId].hand = players[playerId].hand.filter(
    (cardId) => cardId !== playedCardId,
  )
  players[playerId].discard = players[playerId].discard.filter(
    (cardId) => cardId !== playedCardId,
  )
  players[playerId].board = [...players[playerId].board, playedCard.id]
}
