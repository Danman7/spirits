import {
  AttackOrder,
  CARD_STACKS,
  CardStack,
  DuelAction,
  DuelDispatch,
  DuelPlayers,
  DuelUser,
  INITIAL_CARDS_DRAWN_IN_DUEL,
  Player,
  PlayerCards,
  PlayerStacks,
  PlayerStacksAndCards,
  STARTING_COINS_IN_DUEL,
} from 'src/modules/duel'
import { CardBaseName, CardBases } from 'src/shared/data'
import { Agent } from 'src/shared/types'
import { generateUUID, shuffleArray } from 'src/shared/utils'

export const getPlayableCardIds = (player: Player) =>
  player.hand.filter((cardId) => player.cards[cardId].cost <= player.coins)

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
        const cardId = generateUUID()

        partialPlayer.cards = {
          ...partialPlayer.cards,
          [cardId]: { id: cardId, ...CardBases[cardBaseName] },
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

export const sortDuelPlayers = (
  players: DuelPlayers,
  loggedInPlayerId: string,
) =>
  Object.values(players).sort(
    (playerA, playerB) =>
      Number(playerA.id === loggedInPlayerId) -
      Number(playerB.id === loggedInPlayerId),
  )

export const getNeighboursIndexes = (
  index: number,
  array: string[],
): [] | [number] | [number, number] => {
  if (array.length <= 1) return []

  return index === 0
    ? [1]
    : index === array.length - 1
      ? [index - 1]
      : [index - 1, index + 1]
}

const moveCardsForPlayer = ({
  player,
  source,
  target,
  count = 1,
}: {
  player: Player
  source: CardStack
  target: CardStack
  count?: number
}): Partial<Player> => {
  const sourceStack = [...player[source]]
  const targetStack = [...player[target]]

  if (sourceStack.length === 0) return {}

  return {
    [source]: sourceStack.slice(count),
    [target]: [...targetStack, ...sourceStack.slice(0, count)],
  }
}

export const moveSingleCard = ({
  player,
  cardId,
  target,
}: {
  player: Player
  cardId: string
  target: CardStack
}): Partial<PlayerStacks> => {
  const updatedStacks: Partial<PlayerStacks> = {}

  CARD_STACKS.forEach((stack) => {
    if (stack !== target) {
      updatedStacks[stack] = player[stack].filter((id) => id !== cardId)
    }
  })

  updatedStacks[target] = [...player[target], cardId]

  return updatedStacks
}

export const drawInitialCards = (player: Player): Partial<Player> =>
  moveCardsForPlayer({
    player,
    count: INITIAL_CARDS_DRAWN_IN_DUEL,
    source: 'deck',
    target: 'hand',
  })

export const drawCardFromDeck = (player: Player): Partial<Player> =>
  moveCardsForPlayer({
    player,
    count: 1,
    source: 'deck',
    target: 'hand',
  })

export const calculateAttackQueue = (
  players: DuelPlayers,
  playerOrder: [string, string],
): AttackOrder[] => {
  const [activePlayerId, inactivePlayerId] = playerOrder
  const activePlayerBoard = players[activePlayerId].board

  return activePlayerBoard.flatMap((attackerId, index) => {
    const defenderId =
      players[inactivePlayerId].board[index] ||
      players[inactivePlayerId].board.at(-1) ||
      ''
    const queue: AttackOrder[] = [
      { attackerId, defenderId, defendingPlayerId: inactivePlayerId },
    ]

    const defendingAgent = players[inactivePlayerId].cards[defenderId] as Agent

    if (defendingAgent?.traits?.retaliates)
      queue.push({
        attackerId: defenderId,
        defenderId: attackerId,
        defendingPlayerId: activePlayerId,
      })

    return queue
  })
}

export const redrawCard = (player: Player, cardId: string): Partial<Player> => {
  const { hand, deck } = player

  const cardMovedToBottomOfDeck: Partial<Player> = {
    hand: hand.filter((id) => id !== cardId),
    deck: [...deck, cardId],
  }

  return drawCardFromDeck({ ...player, ...cardMovedToBottomOfDeck })
}

export const filterBrowsedCards = (cards: PlayerCards, stack: string[]) =>
  Object.fromEntries(Object.entries(cards).filter(([id]) => stack.includes(id)))

export const haveBothPlayersDrawnCards = (players: DuelPlayers) =>
  Object.values(players).every(
    ({ hand }) => hand.length >= INITIAL_CARDS_DRAWN_IN_DUEL,
  )

export const getOnPlayCardPredicate = (
  action: DuelAction,
  players: DuelPlayers,
  baseName: CardBaseName,
) =>
  action.type === 'PLAY_CARD' &&
  !!action.shouldPay &&
  players[action.playerId].cards[action.cardId].name ===
    CardBases[baseName].name

export const getPlayAllCopiesEffect = (
  action: DuelAction,
  players: DuelPlayers,
  comparingBase: CardBaseName,
  dispatch: DuelDispatch,
) => {
  if (action.type !== 'PLAY_CARD') return

  const { playerId, cardId: playedCardId } = action

  const player = players[playerId]
  const { cards, board, discard } = player
  const base = CardBases[comparingBase]

  // Move each copy to board if it is not on board or in discard
  Object.keys(cards).forEach((cardId) => {
    const { name } = cards[cardId]

    if (
      name !== base.name ||
      cardId === playedCardId ||
      board.includes(cardId) ||
      discard.includes(cardId)
    )
      return

    dispatch({
      type: 'PLAY_CARD',
      cardId,
      playerId,
      shouldPay: false,
    })
  })
}
