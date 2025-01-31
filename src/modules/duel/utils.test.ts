import {
  CARD_STACKS,
  DUEL_STARTING_COINS,
  DuelState,
  EMPTY_PLAYER,
  Player,
  createDuelCard,
  getNeighboursIndexes,
  getPlayableCardIds,
  moveCardBetweenStacks,
  normalizePlayerCards,
} from 'src/modules/duel'
import { playerId, stackedDuelStateMock } from 'src/shared/__mocks__'
import { CardBaseName, CardBases } from 'src/shared/data'

test('createPlayCardFromPrototype should create a new play ready card from a card prototype', () => {
  const baseName: CardBaseName = 'TempleGuard'
  const base = CardBases[baseName]

  const newCard = createDuelCard('TempleGuard')

  expect(newCard).toEqual(
    expect.objectContaining({
      cost: base.cost,
      strength: base.strength,
      traits: base.traits,
    }),
  )
  expect(newCard.baseName).toEqual('TempleGuard')
  expect(newCard.id).toBeDefined()
})

it('should get all playable card ids for a given player with getPlayableCardIds', () => {
  const mockBudgetPlayer: Player = {
    ...EMPTY_PLAYER,
    id: 'player3',
    name: 'Hume',
    coins: DUEL_STARTING_COINS,
    ...normalizePlayerCards({
      hand: ['TempleGuard', 'HammeriteNovice'],
    }),
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

  Object.values(normalizedCards.cards).forEach((card) => {
    expect(normalizedCards.cards?.[card.id]).toBe(card)
  })

  CARD_STACKS.forEach((stack) => {
    expect(normalizedCards[stack]).toHaveLength(1)
  })
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

  const state: DuelState = { ...stackedDuelStateMock }

  expect(player.deck).toHaveLength(2)
  expect(player.hand).toHaveLength(2)

  const movedCardId = player.deck[0]

  moveCardBetweenStacks({
    state: stackedDuelStateMock,
    playerId,
    movedCardId,
    to: 'hand',
  })

  const updatedPlayer = state.players[playerId]

  expect(updatedPlayer.deck).toHaveLength(1)
  expect(updatedPlayer.hand).toHaveLength(3)

  expect(updatedPlayer.hand).toContain(movedCardId)
  expect(updatedPlayer.hand.indexOf(movedCardId)).toBe(2)
})

it('should move a card to the front of a stack', () => {
  const player = { ...stackedDuelStateMock.players[playerId] }

  const state: DuelState = { ...stackedDuelStateMock }

  expect(player.deck).toHaveLength(1)
  expect(player.hand).toHaveLength(3)

  const movedCardId = player.hand[0]

  moveCardBetweenStacks({
    state: stackedDuelStateMock,
    playerId,
    movedCardId,
    to: 'deck',
    inFront: true,
  })

  const updatedPlayer = state.players[playerId]

  expect(updatedPlayer.deck).toHaveLength(2)
  expect(updatedPlayer.hand).toHaveLength(2)

  expect(updatedPlayer.deck).toContain(movedCardId)
  expect(updatedPlayer.deck.indexOf(movedCardId)).toBe(0)
})

it('should get the correct neighbour indexes from array', () => {
  expect(getNeighboursIndexes(0, [])).toEqual([])
  expect(getNeighboursIndexes(0, ['1'])).toEqual([])
  expect(getNeighboursIndexes(0, ['1', '2'])).toEqual([1])
  expect(getNeighboursIndexes(1, ['1', '2'])).toEqual([0])
  expect(getNeighboursIndexes(1, ['1', '2', '3'])).toEqual([0, 2])
})
