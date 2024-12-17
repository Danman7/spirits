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
import { DuelCard, Player, PlayerCards } from 'src/features/duel/types'
import {
  copyDuelCard,
  createDuelCard,
  getPlayableCardIds,
  normalizePlayerCards,
} from 'src/features/duel/utils'

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
