import {
  initialPlayerMock,
  opponentId,
  opponentMock,
  playerId,
  stackedDuelStateMock,
  stackedPlayerMock,
  userMock,
} from 'src/__mocks__/DuelMocks'
import {
  CARD_STACKS,
  INITIAL_CARDS_DRAWN_IN_DUEL,
  STARTING_COINS_IN_DUEL,
} from 'src/modules/duel/constants'
import { AttackOrder, Player } from 'src/modules/duel/DuelTypes'
import {
  calculateAttackQueue,
  drawCardFromDeck,
  drawInitialCards,
  getNeighboursIndexes,
  getPlayableCardIds,
  moveSingleCard,
  normalizePlayerCards,
  redrawCard,
  setInitialPlayerOrder,
  setupInitialDuelPlayerFromUser,
  sortDuelPlayerIdsForBoard,
} from 'src/modules/duel/DuelUtils'

it('should get all playable card ids for a given player with getPlayableCardIds', () => {
  const mockBudgetPlayer: Player = {
    id: 'player3',
    name: 'Hume',
    coins: STARTING_COINS_IN_DUEL,
    ...normalizePlayerCards({
      hand: ['TempleGuard', 'HammeriteNovice'],
    }),
    income: 0,
    hasPerformedAction: false,
  }

  expect(getPlayableCardIds(mockBudgetPlayer)).toHaveLength(2)
  expect(getPlayableCardIds({ ...mockBudgetPlayer, coins: 3 })).toHaveLength(1)
  expect(getPlayableCardIds({ ...mockBudgetPlayer, coins: 3 })).toEqual([
    mockBudgetPlayer.hand[1],
  ])
  expect(getPlayableCardIds({ ...mockBudgetPlayer, coins: 0 })).toHaveLength(0)
})

it("should normalize a player's cards into all possible stacks with normalizePlayerCards", () => {
  const normalizedCards = normalizePlayerCards({
    board: ['TempleGuard'],
    hand: ['HammeriteNovice'],
    deck: ['Haunt'],
    discard: ['Zombie'],
  })

  CARD_STACKS.forEach((stack) => {
    expect(normalizedCards[stack]).toHaveLength(1)
  })

  expect(Object.keys(normalizedCards.cards)).toHaveLength(4)
})

it("should normalize a player's cards into some stacks with normalizePlayerCards", () => {
  const normalizedEmptyCards = normalizePlayerCards({
    board: ['TempleGuard'],
  })

  expect(normalizedEmptyCards.deck).toHaveLength(0)
  expect(normalizedEmptyCards.hand).toHaveLength(0)
  expect(normalizedEmptyCards.discard).toHaveLength(0)
})

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

it('should setup setup initial duel players from users', () => {
  const player = setupInitialDuelPlayerFromUser(userMock)
  expect(player).toMatchObject({
    name: userMock.name,
    id: userMock.id,
    coins: STARTING_COINS_IN_DUEL,
    hand: [],
    board: [],
    discard: [],
    hasPerformedAction: false,
    income: 0,
  })

  expect(player.deck).toHaveLength(userMock.deck.length)
})

it('should sort duel players so logged in user is second', () => {
  expect(
    sortDuelPlayerIdsForBoard(stackedDuelStateMock.players, playerId),
  ).toEqual([opponentId, playerId])
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
  expect(calculateAttackQueue(players, playerOrder)).toEqual([
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
