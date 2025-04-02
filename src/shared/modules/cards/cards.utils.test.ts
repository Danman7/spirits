import { Agent } from 'src/shared/modules/cards/cards.types'
import {
  getCardBaseFromName,
  getCardFactionColor,
} from 'src/shared/modules/cards/cards.utils'
import { HammeriteNovice } from 'src/shared/modules/cards/data/OrderBases'
import { defaultTheme } from 'src/shared/styles/defaultTheme'

const { orderFaction, chaosFaction, shadowFaction } = defaultTheme.colors

it('should get the proper faction color', () => {
  expect(getCardFactionColor(['Chaos'])).toBe(chaosFaction)
  expect(getCardFactionColor(['Order'])).toBe(orderFaction)
  expect(getCardFactionColor(['Shadow'])).toBe(shadowFaction)
  expect(getCardFactionColor(['Chaos', 'Shadow'])).toBe(
    `linear-gradient(300deg, ${chaosFaction}, ${shadowFaction})`,
  )
})

it('should get the card base from its name', () => {
  const base = getCardBaseFromName(HammeriteNovice.name) as Agent

  const { name, cost, strength } = base

  expect(name).toBe(HammeriteNovice.name)
  expect(cost).toBe(HammeriteNovice.cost)
  expect(strength).toBe(HammeriteNovice.strength)

  expect(getCardBaseFromName('non-existent name')).toBeFalsy()
})
