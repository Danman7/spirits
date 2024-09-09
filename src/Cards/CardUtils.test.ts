import { Haunt } from 'src/Cards/CardPrototypes'
import { CardFaction, CardType } from 'src/Cards/CardTypes'
import { getFactionColor, joinCardTypes } from 'src/Cards/CardUtils'

it('should join the card types in a string', () => {
  expect(joinCardTypes(Haunt.types)).toBe(
    `${CardType.Undead}, ${CardType.Hammerite}`
  )
})

it('should get the proper faction color', () => {
  expect(getFactionColor([CardFaction.Chaos])).toBe(
    'var(--chaos-faction-color)'
  )
  expect(getFactionColor([CardFaction.Order])).toBe(
    'var(--order-faction-color)'
  )
  expect(getFactionColor([CardFaction.Shadow])).toBe(
    'var(--shadow-faction-color)'
  )
  expect(getFactionColor([CardFaction.Chaos, CardFaction.Shadow])).toBe(
    `linear-gradient(300deg, ${'var(--chaos-faction-color)'}, ${'var(--shadow-faction-color)'})`
  )
})
