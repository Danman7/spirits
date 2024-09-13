import { PlayCard } from 'src/Cards/CardTypes'
import { Player, GameState } from 'src/shared/redux/StateTypes'

export const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8

    return v.toString(16)
  })

export const getRandomArrayItem = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)]

export const getCoinsMessage = (coins: number) =>
  `${coins} ${coins > 1 ? 'coins' : 'coin'}`

export const normalizeArrayOfPlayers = (players: Player[]) =>
  players.reduce((statePlayers: GameState['players'], player) => {
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
