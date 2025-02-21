import { CARD_STACKS, STARTING_COINS_IN_DUEL } from 'src/modules/duel/constants'
import { Player } from 'src/modules/duel/types'
import {
  getNeighboursIndexes,
  getPlayableCardIds,
  moveSingleCard,
  normalizePlayerCards,
} from 'src/modules/duel/utils'
import { playerId, stackedDuelStateMock } from 'src/modules/duel/__mocks__'

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
