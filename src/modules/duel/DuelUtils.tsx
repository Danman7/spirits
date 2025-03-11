import {
  CARD_STACKS,
  STARTING_COINS_IN_DUEL,
} from 'src/modules/duel/DuelConstants'
import {
  CardStack,
  DuelPlayers,
  DuelUser,
  Player,
  PlayerStacksAndCards,
} from 'src/modules/duel/DuelTypes'
import { CardBaseKey } from 'src/shared/modules/cards/CardTypes'
import { CardBases } from 'src/shared/modules/cards/data/bases'
import { generateUUID, shuffleArray } from 'src/shared/SharedUtils'

export const getPlayableCardIds = (player: Player) =>
  player.hand.filter((cardId) => player.cards[cardId].cost <= player.coins)

export const normalizePlayerCards = (
  stacks: Partial<Record<CardStack, CardBaseKey[]>>,
): PlayerStacksAndCards => {
  const partialPlayer: PlayerStacksAndCards = {
    deck: [],
    hand: [],
    board: [],
    discard: [],
    cards: {},
  }

  CARD_STACKS.forEach((stack) => {
    if (stacks[stack]) {
      stacks[stack].forEach((CardBaseKey) => {
        const cardId = generateUUID()

        partialPlayer.cards = {
          ...partialPlayer.cards,
          [cardId]: { id: cardId, ...CardBases[CardBaseKey] },
        }
        partialPlayer[stack] = [...partialPlayer[stack], cardId]
      })
    }
  })

  return partialPlayer
}

export const setupInitialDuelPlayerFromUser = (user: DuelUser): Player => ({
  ...user,
  ...normalizePlayerCards({ deck: shuffleArray(user.deck) }),
  coins: STARTING_COINS_IN_DUEL,
  hand: [],
  board: [],
  discard: [],
  hasPerformedAction: false,
  income: 0,
})

export const sortDuelPlayerIdsForBoard = (
  players: DuelPlayers,
  loggedInPlayerId: string,
) =>
  Object.values(players)
    .sort(
      (playerA, playerB) =>
        Number(playerA.id === loggedInPlayerId) -
        Number(playerB.id === loggedInPlayerId),
    )
    .map(({ id }) => id) as [string, string]

export const getOtherPlayer = (
  players: DuelPlayers,
  playerOrder: [string, string],
  playerId: string,
) => {
  const otherId = playerOrder[0] === playerId ? playerOrder[1] : playerOrder[0]
  return players[otherId]
}
