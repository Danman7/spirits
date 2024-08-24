import { Haunt } from './AllCards'
import { CHAOS_COLOR, ORDER_COLOR, SHADOW_COLOR } from './constants'
import { CardFaction, CardType } from './CardTypes'
import { getFactionColor, joinCardTypes } from './CardUtils'

describe('Card utils', () => {
  it('should join the card types in a string', () => {
    expect(joinCardTypes(Haunt.types)).toBe(
      `${CardType.Undead}, ${CardType.Hammerite}`
    )
  })

  it('should get the proper faction color', () => {
    expect(getFactionColor([CardFaction.Chaos])).toBe(CHAOS_COLOR)
    expect(getFactionColor([CardFaction.Order])).toBe(ORDER_COLOR)
    expect(getFactionColor([CardFaction.Shadow])).toBe(SHADOW_COLOR)
    expect(getFactionColor([CardFaction.Chaos, CardFaction.Shadow])).toBe(
      `linear-gradient(300deg, ${CHAOS_COLOR}, ${SHADOW_COLOR})`
    )
  })
})
