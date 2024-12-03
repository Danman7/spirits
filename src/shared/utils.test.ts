import { RootState } from 'src/app/store'
import {
  BookOfAsh,
  HammeriteNovice,
  Haunt,
  TempleGuard,
  Zombie,
} from 'src/features/cards/CardBases'
import { DuelCard } from 'src/features/cards/types'
import {
  CARD_STACKS,
  DEFAULT_COINS_AMOUNT,
  EMPTY_PLAYER,
} from 'src/features/duel/constants'
import { initialState } from 'src/features/duel/slice'
import { Player, PlayerCardAction, PlayerCards } from 'src/features/duel/types'
import {
  copyDuelCard,
  createDuelCard,
  generateUUID,
  getCoinsMessage,
  getFactionColor,
  getOnPlayPredicate,
  getPlayableCardIds,
  getRandomArrayItem,
  joinCardCategories,
  normalizePlayerCards,
  shuffleArray,
} from 'src/shared/utils'

it('should generate a UUID', () => {
  expect(generateUUID()).toHaveLength(36)
})

it('should get a random item from an array', () => {
  const array = [1, 2, 3, 4]

  expect(array).toContain(getRandomArrayItem(array))
})

it('should shuffle an array', () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

  const shuffledArray = shuffleArray([...array])

  expect(shuffledArray).not.toEqual(array)

  for (let index = 0; index < array.length; index++) {
    expect(shuffledArray).toContain(array[index])
  }
})

it('should show the proper coins message', () => {
  expect(getCoinsMessage(1)).toBe('1 coin')
  expect(getCoinsMessage(2)).toBe('2 coins')
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

test('joinCardTypes should return a joined types string for a card', () => {
  expect(joinCardCategories(Haunt.categories)).toBe('Undead, Hammerite')
})

test('getFactionColor should get the proper faction color', () => {
  expect(getFactionColor(['Chaos'])).toBe('var(--chaos-faction-color)')
  expect(getFactionColor(['Order'])).toBe('var(--order-faction-color)')
  expect(getFactionColor(['Shadow'])).toBe('var(--shadow-faction-color)')
  expect(getFactionColor(['Chaos', 'Shadow'])).toBe(
    `linear-gradient(300deg, ${'var(--chaos-faction-color)'}, ${'var(--shadow-faction-color)'})`,
  )
})

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

test('getOnPlayPredicate returns the correct check', () => {
  const cardId = 'card'
  const playerId = 'player'

  const mockAction: PlayerCardAction = {
    type: 'duel/playCard',
    payload: {
      cardId,
      playerId,
    },
  }

  const mockState: RootState = {
    duel: {
      ...initialState,
      players: {
        [playerId]: {
          ...EMPTY_PLAYER,
          cards: {
            [cardId]: {
              ...createDuelCard(Haunt),
              id: cardId,
            },
          },
        },
      },
    },
  }

  expect(getOnPlayPredicate(mockAction, mockState, Haunt.name)).toEqual(true)
  expect(getOnPlayPredicate(mockAction, mockState, Zombie.name)).toEqual(false)
})
