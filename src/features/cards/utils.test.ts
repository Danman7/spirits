import { Haunt } from 'src/features/cards/CardBases'
import {
  createDuelCard,
  getFactionColor,
  joinCardCategories,
} from 'src/features/cards/utils'

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
