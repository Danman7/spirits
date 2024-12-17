import { RootState } from 'src/app/store'
import { Haunt, Zombie } from 'src/features/cards/CardBases'
import {
  getFactionColor,
  getOnPlayPredicate,
  joinCardCategories,
} from 'src/features/cards/utils'
import { EMPTY_PLAYER } from 'src/features/duel/constants'
import { initialState } from 'src/features/duel/slice'
import { PlayerCardAction } from 'src/features/duel/types'
import { createDuelCard } from 'src/features/duel/utils'

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
