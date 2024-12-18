import {
  BookOfAsh,
  HammeriteNovice,
  Haunt,
  TempleGuard,
  Zombie,
} from 'src/features/cards/CardBases'
import {
  CARD_STACKS,
  DEFAULT_COINS_AMOUNT,
  EMPTY_PLAYER,
} from 'src/features/duel/constants'
import { initializeEndTurn, moveCardToDiscard } from 'src/features/duel/slice'
import {
  DuelCard,
  DuelState,
  Player,
  PlayerCards,
} from 'src/features/duel/types'
import {
  copyDuelCard,
  createDuelCard,
  getPlayableCardIds,
  moveCardBetweenStacks,
  normalizePlayerCards,
  triggerPostCardPlay,
} from 'src/features/duel/utils'
import { playerId, stackedDuelState } from 'src/shared/__mocks__'

test('createPlayCardFromPrototype should create a new play ready card from a card prototype', () => {
  const newCard = createDuelCard(Haunt)

  expect(newCard).toEqual(expect.objectContaining(Haunt))
  expect(newCard.base).toEqual({
    cost: Haunt.cost,
    strength: Haunt.strength,
  })
  expect(newCard.id).toBeDefined()
})

test('copyDuelCard', () => {
  const newAgent = createDuelCard(Haunt)
  const updatedCard: DuelCard = { ...newAgent, strength: newAgent.strength - 1 }
  const copiedCard = copyDuelCard(updatedCard)

  expect(copiedCard.id).not.toBe(updatedCard.id)
  expect(copiedCard.strength).toBe(newAgent.strength)

  const newInstant = createDuelCard(BookOfAsh)
  const copiedInstant = copyDuelCard(newInstant)

  expect(copiedInstant.strength).toBe(0)
})

it('should get all playable card ids for a given player with getPlayableCardIds', () => {
  const mockBudgetPlayer: Player = {
    ...EMPTY_PLAYER,
    id: 'player3',
    name: 'Hume',
    coins: DEFAULT_COINS_AMOUNT,
    ...normalizePlayerCards({
      hand: [TempleGuard, HammeriteNovice],
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
    board: [TempleGuard],
    hand: [HammeriteNovice],
    deck: [Haunt],
    discard: [Zombie],
  })

  Object.values(normalizedCards.cards as PlayerCards).forEach((card) => {
    expect(normalizedCards.cards?.[card.id]).toBe(card)
  })

  CARD_STACKS.forEach((stack) => {
    expect(normalizedCards[stack]).toHaveLength(1)
  })
})

it("should normalize a player's cards into some stacks with normalizePlayerCards", () => {
  const normalizedEmptyCards = normalizePlayerCards({
    board: [TempleGuard],
  })

  expect(normalizedEmptyCards.deck).toHaveLength(0)
  expect(normalizedEmptyCards.hand).toHaveLength(0)
  expect(normalizedEmptyCards.discard).toHaveLength(0)
})

it('should move a card between stacks', () => {
  const player = { ...stackedDuelState.players[playerId] }

  const state: DuelState = { ...stackedDuelState }

  expect(player.deck).toHaveLength(2)
  expect(player.hand).toHaveLength(2)

  const movedCardId = player.deck[0]

  moveCardBetweenStacks({
    state: stackedDuelState,
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
  const player = { ...stackedDuelState.players[playerId] }

  const state: DuelState = { ...stackedDuelState }

  expect(player.deck).toHaveLength(1)
  expect(player.hand).toHaveLength(3)

  const movedCardId = player.hand[0]

  moveCardBetweenStacks({
    state: stackedDuelState,
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

it('should trigger post play agent actions', () => {
  const mockDispatch = jest.fn()

  const card = createDuelCard(Haunt)

  triggerPostCardPlay({ dispatch: mockDispatch, playerId, card })

  expect(mockDispatch).toHaveBeenCalledWith(initializeEndTurn())
})

it('should trigger post play instant actions', () => {
  const mockDispatch = jest.fn()

  const card = createDuelCard(BookOfAsh)

  triggerPostCardPlay({ dispatch: mockDispatch, playerId, card })

  expect(mockDispatch).toHaveBeenCalledWith(
    moveCardToDiscard({
      cardId: card.id,
      playerId,
    }),
  )
  expect(mockDispatch).toHaveBeenCalledWith(initializeEndTurn())
})
