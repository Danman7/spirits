import { Action } from '@reduxjs/toolkit'
import { ListenerApi } from 'src/app'
import {
  CARD_STACKS,
  CardStack,
  DUEL_STARTING_COINS,
  DuelCard,
  DuelPlayers,
  DuelState,
  DuelUser,
  playCard,
  Player,
  PlayerStacksAndCards,
} from 'src/modules/duel'
import { CardBaseName, CardBases } from 'src/shared/data'
import { generateUUID, shuffleArray } from 'src/shared/utils'

export const createDuelCard = (baseName: CardBaseName): DuelCard => ({
  ...CardBases[baseName],
  id: generateUUID(),
  baseName,
})

/**
 * Returns an array of ids of all cards in a player's hand that cost within the player's coins reserve.
 * @param player A Player object
 */
export const getPlayableCardIds = (player: Player) =>
  player.hand.filter((cardId) => player.cards[cardId].cost <= player.coins)

/**
 * Takes a record with a card stack as key and an array of card bases as value and returns a partial player object with normalized cards and stacks with the card ids to be concatenated with a player object.
 * @example
 * normalizePlayerCards({
	   board: [TempleGuard],
	   hand: [HammeriteNovice],
  })
*/
export const normalizePlayerCards = (
  stacks: Partial<Record<CardStack, CardBaseName[]>>,
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
      stacks[stack].forEach((cardBaseName) => {
        const card = createDuelCard(cardBaseName)

        partialPlayer.cards = {
          ...partialPlayer.cards,
          [card.id]: card,
        }
        partialPlayer[stack] = [...partialPlayer[stack], card.id]
      })
    }
  })

  return partialPlayer
}

/**
 * Takes a user object and returns a player object in its expected initial state for a duel.
 */
export const setupInitialDuelPlayerFromUser = (user: DuelUser): Player => ({
  ...user,
  ...normalizePlayerCards({ deck: shuffleArray(user.deck) }),
  coins: DUEL_STARTING_COINS,
  hand: [],
  board: [],
  discard: [],
  hasPerformedAction: false,
  income: 0,
})

interface MoveCardBetweenStacksArgs {
  state: DuelState
  playerId: string
  movedCardId: string
  to: CardStack
  inFront?: boolean
}

/**
 * This utility handles moving cards between stacks during a duel. It filters a card’s id from all a player’s stacks and adds it to the target stack. It manipulates the state directly, thus requiring it as a prop.
 */
export const moveCardBetweenStacks = ({
  state,
  playerId,
  movedCardId,
  to,
  inFront,
}: MoveCardBetweenStacksArgs) => {
  const { players } = state

  if (!players[playerId].cards[movedCardId]) return

  CARD_STACKS.forEach((stack) => {
    if (stack !== to) {
      players[playerId][stack] = players[playerId][stack].filter(
        (cardId) => cardId !== movedCardId,
      )
    }
  })

  players[playerId][to] = inFront
    ? [movedCardId, ...players[playerId][to]]
    : [...players[playerId][to], movedCardId]
}

/**
 * Sorts players so the logged in player prespective is on the bottom of the board.
 */
export const sortDuelPlayers = (
  players: DuelPlayers,
  loggedInPlayerId: string,
) =>
  Object.values(players).sort(
    (playerA, playerB) =>
      Number(playerA.id === loggedInPlayerId) -
      Number(playerB.id === loggedInPlayerId),
  )

/**
 * Get the id of the opposite player.
 */
export const getOppositePlayerId = (players: DuelPlayers, playerId: string) =>
  Object.keys(players).find((id) => id !== playerId)

export const getOnPlayPredicateForCardBase = (
  action: Action,
  players: DuelPlayers,
  baseName: CardBaseName,
) =>
  playCard.match(action) &&
  players[action.payload.playerId].cards[action.payload.cardId].baseName ===
    baseName

export const getPlayAllCopiesEffect = (
  action: Action,
  listenerApi: ListenerApi,
  comparingBase: CardBaseName,
) => {
  if (playCard.match(action)) {
    const { players } = listenerApi.getState().duel
    const { playerId, cardId: playedCardId } = action.payload

    const player = players[playerId]
    const { cards, board, discard } = player

    // Move each copy to board if it is not on board or in discard
    Object.values(cards).forEach(({ id, baseName }) => {
      if (
        baseName === comparingBase &&
        id !== playedCardId &&
        !board.includes(id) &&
        !discard.includes(id)
      ) {
        listenerApi.dispatch(
          playCard({
            cardId: id,
            playerId,
            shouldPay: false,
          }),
        )
      }
    })
  }
}

export const getNeighboursIndexes = (
  index: number,
  array: string[],
): [] | [number] | [number, number] => {
  if (array.length <= 1) {
    return []
  }

  if (!index && array.length > 1) {
    return [1]
  }

  if (index === array.length - 1 && array.length > 1) {
    return [index - 1]
  }

  return [index - 1, index + 1]
}
