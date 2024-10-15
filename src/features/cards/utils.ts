import { FACTION_COLOR_MAP } from 'src/features/cards/constants'
import { Agent, Card, Instant, PlayCard } from 'src/features/cards/types'

import { generateUUID } from 'src/shared/utils'

export const joinCardTypes = (types: Card['types']) => types.join(', ')

export const getFactionColor = (factions: Card['factions']) => {
  const firstColor = FACTION_COLOR_MAP[factions[0]]

  if (factions.length === 1) {
    return firstColor
  }

  return `linear-gradient(300deg, ${firstColor}, ${
    FACTION_COLOR_MAP[factions[1]]
  })`
}

export const createPlayCardFromPrototype = <CardKind extends Card = Agent>(
  cardPrototype: Card,
): PlayCard<CardKind> => {
  const { kind } = cardPrototype

  const id = generateUUID()

  if (kind === 'agent') {
    return {
      ...cardPrototype,
      id,
      prototype: {
        cost: cardPrototype.cost,
        strength: cardPrototype.strength,
      },
    } as PlayCard<Agent>
  }

  return {
    ...cardPrototype,
    id,
    prototype: {
      cost: cardPrototype.cost,
    },
  } as PlayCard<Instant>
}
