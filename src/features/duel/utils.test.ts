import {
  getPlayableCardIds,
  normalizeArrayOfCards,
  initializeCardsAndDeck,
} from 'src/features/duel/utils'
import { DEFAULT_COINS_AMOUNT, EMPTY_PLAYER } from 'src/features/duel/constants'
import { Player } from 'src/features/duel/types'

import {
  HammeriteNovice,
  Haunt,
  TempleGuard,
} from 'src/features/cards/CardBases'
import { createDuelCard } from 'src/features/cards/utils'

test('getPlayableCardIds should return all playable card ids for a given player', () => {
  const guard = createDuelCard(TempleGuard)
  const novice = createDuelCard(HammeriteNovice)

  const mockBudgetPlayer: Player = {
    ...EMPTY_PLAYER,
    id: 'player3',
    name: 'Hume',
    coins: DEFAULT_COINS_AMOUNT,
    cards: {
      [guard.id]: guard,
      [novice.id]: novice,
    },
    hand: [guard.id, novice.id],
  }

  expect(getPlayableCardIds(mockBudgetPlayer)).toHaveLength(2)
  expect(getPlayableCardIds({ ...mockBudgetPlayer, coins: 3 })).toHaveLength(1)
  expect(getPlayableCardIds({ ...mockBudgetPlayer, coins: 3 })).toEqual([
    mockBudgetPlayer.hand[1],
  ])
  expect(getPlayableCardIds({ ...mockBudgetPlayer, coins: 0 })).toHaveLength(0)
})

test('normalizeArrayOfCards should normalize an array of cards', () => {
  const hammerite = createDuelCard(HammeriteNovice)
  const haunt = createDuelCard(Haunt)

  const normalizedPlayers = normalizeArrayOfCards([hammerite, haunt])

  expect(normalizedPlayers).toEqual({
    [hammerite.id]: hammerite,
    [haunt.id]: haunt,
  })
})

test("initializeCardsAndDeck should prepare a player's nomralized cards and deck", () => {
  const guard = createDuelCard(TempleGuard)
  const novice = createDuelCard(HammeriteNovice)
  const haunt = createDuelCard(Haunt)

  const nomralizedCardsAndDeck = initializeCardsAndDeck([guard, novice, haunt])

  expect(nomralizedCardsAndDeck.deck).toHaveLength(3)
  expect(nomralizedCardsAndDeck.cards[guard.id]).toBe(guard)
})
