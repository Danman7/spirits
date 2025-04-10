import {
  CARD_STACKS,
  INCOME_PER_TURN,
  INITIAL_CARDS_DRAWN_IN_DUEL,
  STARTING_COINS_IN_DUEL,
} from 'src/modules/duel/duel.constants'
import { DuelPlayers, Player, PlayerStacks } from 'src/modules/duel/duel.types'
import type {
  AttackOrder,
  CardStack,
  DuelCards,
  DuelDispatch,
  DuelState,
  DuelAction,
  PlayCardAction,
  UsersStartingDuel,
  PlayerOrder,
} from 'src/modules/duel/state'
import {
  generatePlayedCopyLogMessage,
  generateTriggerLogMessage,
} from 'src/modules/duel/state/playLogs'

import type { Agent, CardBaseKey } from 'src/shared/modules/cards'
import { CardBases } from 'src/shared/modules/cards'
import {
  generateUUID,
  getRandomArrayItem,
  shuffleArray,
} from 'src/shared/shared.utils'

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
  moveCardsForPlayer({ player, source: 'deck', target: 'hand' })

export const calculateAttackQueue = (state: DuelState): AttackOrder[] => {
  const { players, playerOrder, cards } = state
  const [activePlayerId, inactivePlayerId] = playerOrder
  const { board: activePlayerBoard } = players[activePlayerId]

  return activePlayerBoard.flatMap((attackerId, index) => {
    const defenderId =
      players[inactivePlayerId].board[index] ||
      players[inactivePlayerId].board.at(-1) ||
      ''
    const queue: AttackOrder[] = [
      {
        attackerId,
        attackingPlayerId: activePlayerId,
        defenderId,
        defendingPlayerId: inactivePlayerId,
      },
    ]

    const defendingAgent = cards[defenderId] as Agent

    if (defendingAgent?.traits?.retaliates)
      queue.push({
        attackerId: defenderId,
        attackingPlayerId: inactivePlayerId,
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

export const getOnPlayCardPredicate = (
  action: DuelAction,
  cards: DuelCards,
  baseName: CardBaseKey,
) =>
  action.type === 'PLAY_CARD' &&
  !!action.shouldPay &&
  cards[action.cardId].name === CardBases[baseName].name

export const getPlayAllCopiesEffect = (
  action: DuelAction,
  players: DuelPlayers,
  cards: DuelCards,
  comparingBase: CardBaseKey,
  dispatch: DuelDispatch,
) => {
  const { playerId, cardId: playedCardId } = action as PlayCardAction

  const player = players[playerId]
  const { board, discard, hand, deck } = player
  const base = CardBases[comparingBase]

  Object.keys(cards).forEach((cardId) => {
    const { name } = cards[cardId]

    if (
      name !== base.name ||
      cardId === playedCardId ||
      board.includes(cardId) ||
      discard.includes(cardId) ||
      (!hand.includes(cardId) && !deck.includes(cardId))
    )
      return

    dispatch({ type: 'PLAY_CARD', cardId, playerId, shouldPay: false })

    dispatch({
      type: 'ADD_LOG',
      message: generateTriggerLogMessage(
        generatePlayedCopyLogMessage(base.name),
      ),
    })
  })
}

export const setInitialPlayerOrder = (
  users: UsersStartingDuel,
  firstPlayerIndex?: 0 | 1,
) => {
  const userIds = users.map(({ id }) => id) as PlayerOrder

  const activePlayerId =
    typeof firstPlayerIndex !== 'undefined'
      ? userIds[firstPlayerIndex]
      : getRandomArrayItem(userIds)

  return activePlayerId === userIds[0]
    ? userIds
    : ([...userIds].reverse() as PlayerOrder)
}

export const setupPlayersFromUsers = (
  users: UsersStartingDuel,
): { players: DuelPlayers; cards: DuelCards } => {
  const players: DuelPlayers = {}
  const cards: DuelCards = {}

  users.forEach((user) => {
    const player: Player = {
      ...user,
      coins: STARTING_COINS_IN_DUEL,
      hand: [],
      board: [],
      discard: [],
      deck: [],
      hasPerformedAction: false,
      income: 0,
    }

    shuffleArray(user.deck).forEach((cardBaseKey) => {
      const cardId = generateUUID()
      cards[cardId] = { id: cardId, ...CardBases[cardBaseKey] }
      player.deck.push(cardId)
    })

    players[user.id] = player
  })

  return { cards, players }
}

export const drawInitialCardsForBothPlayers = (players: DuelPlayers) =>
  Object.fromEntries(
    Object.entries(players).map(([playerId, player]) => [
      playerId,
      { ...player, ...drawInitialCards(player) },
    ]),
  )

export const handleIncome = (player: Player) => ({
  income: player.income - (player.income ? INCOME_PER_TURN : 0),
  coins: player.coins + (player.income ? INCOME_PER_TURN : 0),
})
