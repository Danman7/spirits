import { Action } from '@reduxjs/toolkit'
import { ListenerApi } from 'src/app/listenerMiddleware'
import { AppDispatch } from 'src/app/store'
import { CARD_STACKS, DUEL_STARTING_COINS } from 'src/features/duel/constants'
import { discardCard, playCard, resolveTurn } from 'src/features/duel/slice'
import {
  CardStack,
  DuelCard,
  DuelPlayers,
  DuelState,
  DuelUser,
  Player,
  PlayerCards,
  PlayerStacksAndCards,
} from 'src/features/duel/types'
import { CardBase } from 'src/shared/types'
import { generateUUID, shuffleArray } from 'src/shared/utils'

/**
 * @param base A card base object (e.g. HammeriteNovice or Zombie)
 * @returns A ready for duel card object with unique id and base properties for reference
 * @example createDuelCard({...Haunt}) // {...Haunt, id: 'e4g34', base: {...Haunt}}
 */
export const createDuelCard = (base: CardBase): DuelCard => ({
  ...base,
  id: generateUUID(),
  strength: base.strength || 0,
  base: {
    strength: base.strength || 0,
    cost: base.cost,
  },
})

/**
 * @param card A ready for duel card object
 * @returns The same card object with a new unique id and reset base properties
 */
export const copyDuelCard = (card: DuelCard): DuelCard => ({
  ...card,
  strength: card.base.strength || 0,
  cost: card.base.cost,
  id: generateUUID(),
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
  stacks: Partial<Record<CardStack, CardBase[]>>,
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
      stacks[stack].forEach((cardBase) => {
        const card = createDuelCard(cardBase)

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
 * A state utility method for moving cards between stacks. It removes the given card id from whichever stack it is and appends or prepends it to the target. Manipulates the state directly.
 * @example 
 * moveCardBetweenStacks({
    movedCardId: deck[0],
    playerId: id,
    state,
    to: 'hand',
})
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

interface triggerPostCardPlayProps {
  dispatch: AppDispatch
  playerId: string
  card: DuelCard
}

/**
 * A utility that triggers all actions that have to happen after a card is played.
 */
export const triggerPostCardPlay = ({
  dispatch,
  playerId,
  card,
}: triggerPostCardPlayProps) => {
  const { type, id } = card

  if (type === 'instant') {
    dispatch(discardCard({ cardId: id, playerId }))
  }

  dispatch(resolveTurn())
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
 * Get the id of the duel player not set as active.
 */
export const getInactivePlayerId = (
  players: DuelPlayers,
  activePlayerId: string,
) => Object.keys(players).filter((id) => id !== activePlayerId)[0]

/**
 * Get the index of the current attacker.
 */
export const getAttackingAgentIndex = (
  players: DuelPlayers,
  activePlayerId: string,
  attackingAgentId: string,
) => players[activePlayerId].board.indexOf(attackingAgentId)

export const getOnPlayPredicateForCardBase = (
  action: Action,
  cards: PlayerCards,
  base: CardBase,
) => playCard.match(action) && cards[action.payload.cardId].name === base.name

export const getPlayAllCopiesEffect = (
  action: Action,
  listenerApi: ListenerApi,
  base: CardBase,
) => {
  if (playCard.match(action)) {
    const { players } = listenerApi.getState().duel
    const { playerId, cardId: playedCardId } = action.payload

    const player = players[playerId]
    const { cards, board, discard } = player

    // Move each copy to board if it is not on board or in discard
    Object.values(cards).forEach(({ id, name }) => {
      if (
        name === base.name &&
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
