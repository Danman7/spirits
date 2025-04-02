import { Card } from 'src/shared/modules/cards/cards.types'
import { CardBases } from 'src/shared/modules/cards/data/bases'
import { defaultTheme } from 'src/shared/styles/defaultTheme'

export const getCardFactionColor = (factions: Card['factions']): string => {
  const { orderFaction, chaosFaction, shadowFaction } = defaultTheme.colors

  const FACTION_COLOR_MAP = {
    Order: orderFaction,
    Chaos: chaosFaction,
    Shadow: shadowFaction,
  }

  const firstColor = FACTION_COLOR_MAP[factions[0]]

  if (factions.length === 1) return firstColor

  return `linear-gradient(300deg, ${firstColor}, ${
    FACTION_COLOR_MAP[factions[1]]
  })`
}

export const getCardBaseFromName = (name: string) =>
  Object.values(CardBases).find(({ name: baseName }) => baseName === name)
