import { Haunt } from './AllCards'
import { CHAOS_COLOR, ORDER_COLOR, SHADOW_COLOR } from './constants'
import { CardFaction, CardType } from './types'
import { getCoinsMessage, getFactionColor, joinCardTypes } from './utils'

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

  it('should show the proper coins message', () => {
    expect(getCoinsMessage(1)).toBe('1 coin')
    expect(getCoinsMessage(2)).toBe('2 coins')
  })
})
