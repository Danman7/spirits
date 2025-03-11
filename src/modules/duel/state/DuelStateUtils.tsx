import {
  CARD_STACKS,
  INITIAL_CARDS_DRAWN_IN_DUEL,
} from 'src/modules/duel/DuelConstants'
import {
  AttackOrder,
  CardStack,
  DuelAction,
  DuelDispatch,
  DuelPlayers,
  PlayCardAction,
  Player,
  PlayerStacks,
  UsersStartingDuel,
} from 'src/modules/duel/DuelTypes'
import { setupInitialDuelPlayerFromUser } from 'src/modules/duel/DuelUtils'
import { generateTriggerLogMessage } from 'src/modules/duel/state/DuelLogMessageUtils'
import { hasPlayedAllCopiesLogMessage } from 'src/modules/duel/state/DuelStateMessages'
import { Agent, CardBaseKey } from 'src/shared/modules/cards/CardTypes'
import { CardBases } from 'src/shared/modules/cards/data/bases'
import { getRandomArrayItem } from 'src/shared/SharedUtils'

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
    source: 'deck',
    target: 'hand',
  })

export const calculateAttackQueue = (
  players: DuelPlayers,
  playerOrder: [string, string],
): AttackOrder[] => {
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

    const defendingAgent = players[inactivePlayerId].cards[defenderId] as Agent

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
  players: DuelPlayers,
  baseName: CardBaseKey,
) =>
  action.type === 'PLAY_CARD' &&
  !!action.shouldPay &&
  players[action.playerId].cards[action.cardId].name ===
    CardBases[baseName].name

export const getPlayAllCopiesEffect = (
  action: DuelAction,
  players: DuelPlayers,
  comparingBase: CardBaseKey,
  dispatch: DuelDispatch,
) => {
  const { playerId, cardId: playedCardId } = action as PlayCardAction

  const player = players[playerId]
  const { cards, board, discard } = player
  const base = CardBases[comparingBase]

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

    dispatch({
      type: 'ADD_LOG',
      message: generateTriggerLogMessage(
        hasPlayedAllCopiesLogMessage(base.name),
      ),
    })
  })
}

export const setPlayersFromUsers = (users: UsersStartingDuel): DuelPlayers =>
  Object.fromEntries(
    users.map((user) => [user.id, setupInitialDuelPlayerFromUser(user)]),
  )

export const setInitialPlayerOrder = (
  users: UsersStartingDuel,
  firstPlayerIndex?: 0 | 1,
) => {
  const userIds = users.map(({ id }) => id) as [string, string]

  const activePlayerId =
    typeof firstPlayerIndex !== 'undefined'
      ? userIds[firstPlayerIndex]
      : getRandomArrayItem(userIds)

  return activePlayerId === userIds[0]
    ? userIds
    : ([...userIds].reverse() as [string, string])
}
