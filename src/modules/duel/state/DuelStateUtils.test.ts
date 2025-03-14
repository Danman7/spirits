import {
  initialDuelStateMock,
  opponentMock,
  playerId,
  stackedDuelStateMock,
  userMock,
} from 'src/__mocks__/duelMocks'
import { INITIAL_CARDS_DRAWN_IN_DUEL } from 'src/modules/duel/duelConstants'
import { AttackOrder } from 'src/modules/duel/state/duelStateTypes'
import {
  calculateAttackQueue,
  drawCardFromDeck,
  drawInitialCards,
  getNeighboursIndexes,
  moveSingleCard,
  redrawCard,
  setInitialPlayerOrder,
} from 'src/modules/duel/state/duelStateUtils'

const stackedPlayerMock = stackedDuelStateMock.players[playerId]
const initialPlayerMock = initialDuelStateMock.players[playerId]

it('should move a card between stacks', () => {
  const player = { ...stackedDuelStateMock.players[playerId] }

  expect(player.deck).toHaveLength(2)
  expect(player.hand).toHaveLength(2)

  const cardId = player.deck[0]

  const updatedPlayer = moveSingleCard({
    player,
    cardId,
    target: 'hand',
  })

  expect(updatedPlayer.deck).toHaveLength(1)
  expect(updatedPlayer.hand).toHaveLength(3)

  expect(updatedPlayer.hand).toContain(cardId)
  expect(updatedPlayer.hand?.indexOf(cardId)).toBe(2)
})

it('should get the correct neighbour indexes from array', () => {
  expect(getNeighboursIndexes(0, [])).toEqual([])
  expect(getNeighboursIndexes(0, ['1'])).toEqual([])
  expect(getNeighboursIndexes(0, ['1', '2'])).toEqual([1])
  expect(getNeighboursIndexes(1, ['1', '2'])).toEqual([0])
  expect(getNeighboursIndexes(1, ['1', '2', '3'])).toEqual([0, 2])
})

it('should get the correct indexes of neighbouring cards', () => {
  expect(getNeighboursIndexes(0, [])).toEqual([])
  expect(getNeighboursIndexes(0, ['a', 'b', 'c'])).toEqual([1])
  expect(getNeighboursIndexes(1, ['a', 'b', 'c'])).toEqual([0, 2])
  expect(getNeighboursIndexes(2, ['a', 'b', 'c'])).toEqual([1])
})

it('should update a player when moving a single card between stacks', () => {
  const cardId = stackedPlayerMock.hand[0]
  const { hand, board } = moveSingleCard({
    player: stackedPlayerMock,
    cardId,
    target: 'board',
  })

  expect(hand).not.toContain(cardId)
  expect(board).toContain(cardId)
})

it('should update a player when drawing initial cards', () => {
  const { hand, deck } = drawInitialCards(initialPlayerMock)

  expect(hand).toHaveLength(INITIAL_CARDS_DRAWN_IN_DUEL)
  expect(deck).toHaveLength(
    initialPlayerMock.deck.length - INITIAL_CARDS_DRAWN_IN_DUEL,
  )
})

it('should update a player when drawing a card from deck', () => {
  const { hand, deck } = drawCardFromDeck(initialPlayerMock)

  expect(hand).toHaveLength(initialPlayerMock.hand.length + 1)
  expect(deck).toHaveLength(initialPlayerMock.deck.length - 1)
})

it('should calculate attack queue', () => {
  const { players, playerOrder } = stackedDuelStateMock
  expect(calculateAttackQueue(stackedDuelStateMock)).toEqual([
    {
      attackerId: players[playerOrder[0]].board[0],
      attackingPlayerId: playerOrder[0],
      defenderId: players[playerOrder[1]].board[0],
      defendingPlayerId: playerOrder[1],
    },
  ] as AttackOrder[])
})

it('should redraw a card', () => {
  const { hand, deck } = redrawCard(
    stackedPlayerMock,
    stackedPlayerMock.hand[0],
  )

  expect(deck).toContain(stackedPlayerMock.hand[0])
  expect(hand).toContain(stackedPlayerMock.deck[0])
})

it('should set the initial player order', () => {
  expect(setInitialPlayerOrder([userMock, opponentMock], 0)).toEqual([
    userMock.id,
    opponentMock.id,
  ])

  expect(setInitialPlayerOrder([userMock, opponentMock], 1)).toEqual([
    opponentMock.id,
    userMock.id,
  ])
})
