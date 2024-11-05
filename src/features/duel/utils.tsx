import { DuelState, Player } from 'src/features/duel/types'

import { DuelCard } from 'src/features/cards/types'

export const getPlayableCardIds = (player: Player) =>
  player.hand.filter((cardId) => player.cards[cardId].cost <= player.coins)

export const normalizeArrayOfPlayers = (players: Player[]) =>
  players.reduce((statePlayers: DuelState['players'], player) => {
    statePlayers[player.id] = player

    return statePlayers
  }, {})

export const normalizeArrayOfCards = (cards: DuelCard[]): Player['cards'] =>
  cards.reduce((playerCards: Player['cards'], cards) => {
    playerCards[cards.id] = cards

    return playerCards
  }, {})

export const initializeCardsAndDeck = (
  cards: DuelCard[],
): { cards: Player['cards']; deck: Player['deck'] } => ({
  cards: normalizeArrayOfCards(cards),
  deck: cards.map(({ id }) => id),
})
