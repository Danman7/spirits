import {
  opponentId,
  playerId,
  stackedDuelStateMock,
  userMock,
} from 'src/__mocks__/DuelMocks'
import {
  CARD_STACKS,
  STARTING_COINS_IN_DUEL,
} from 'src/modules/duel/DuelConstants'
import { Player } from 'src/modules/duel/DuelTypes'
import {
  getPlayableCardIds,
  normalizePlayerCards,
  setupInitialDuelPlayerFromUser,
  sortDuelPlayerIdsForBoard,
} from 'src/modules/duel/DuelUtils'

it('should get all playable card ids for a given player with getPlayableCardIds', () => {
  const mockBudgetPlayer: Player = {
    id: 'player3',
    name: 'Hume',
    color: '#495',
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
