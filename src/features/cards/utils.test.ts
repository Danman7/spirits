import { Haunt } from 'src/features/cards/CardPrototypes'
import { CardFaction, CardType } from 'src/features/cards/types'
import {
  createPlayCardFromPrototype,
  getFactionColor,
  joinCardTypes,
} from 'src/features/cards/utils'

test('joinCardTypes should return a joined types string for a card', () => {
  expect(joinCardTypes(Haunt.types)).toBe(
    `${CardType.Undead}, ${CardType.Hammerite}`,
  )
})

test('getFactionColor should get the proper faction color', () => {
  expect(getFactionColor([CardFaction.Chaos])).toBe(
    'var(--chaos-faction-color)',
  )
  expect(getFactionColor([CardFaction.Order])).toBe(
    'var(--order-faction-color)',
  )
  expect(getFactionColor([CardFaction.Shadow])).toBe(
    'var(--shadow-faction-color)',
  )
  expect(getFactionColor([CardFaction.Chaos, CardFaction.Shadow])).toBe(
    `linear-gradient(300deg, ${'var(--chaos-faction-color)'}, ${'var(--shadow-faction-color)'})`,
  )
})

test('createPlayCardFromPrototype should create a new play ready card from a card prototype', () => {
  const newCard = createPlayCardFromPrototype(Haunt)

  expect(newCard).toEqual(expect.objectContaining(Haunt))
  expect(newCard.prototype).toEqual({
    cost: Haunt.cost,
    strength: Haunt.strength,
  })
  expect(newCard.id).toBeDefined()
})
