import { FACTION_COLOR_MAP } from 'src/features/cards/constants'
import {
  Agent,
  CardBase,
  DuelAgent,
  DuelInstant,
  Instant,
  PlayCard,
} from 'src/features/cards/types'
import { generateUUID } from 'src/shared/utils'

export const joinCardTypes = (types: CardBase['types']) => types.join(', ')

export const getFactionColor = (factions: CardBase['factions']) => {
  const firstColor = FACTION_COLOR_MAP[factions[0]]

  if (factions.length === 1) {
    return firstColor
  }

  return `linear-gradient(300deg, ${firstColor}, ${
    FACTION_COLOR_MAP[factions[1]]
  })`
}

export const createPlayCardFromPrototype = (
  cardPrototype: Agent | Instant,
): PlayCard => {
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
    } as DuelAgent
  }

  return {
    ...cardPrototype,
    id,
    prototype: {
      cost: cardPrototype.cost,
    },
  } as DuelInstant
}
