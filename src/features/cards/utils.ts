import { FACTION_COLOR_MAP } from 'src/features/cards/constants'
import {
  CardBase,
  DuelCard,
  GetOnPlayPredicate,
} from 'src/features/cards/types'
import { generateUUID } from 'src/shared/utils'

export const joinCardCategories = (types: CardBase['categories']) =>
  types.join(', ')

export const getFactionColor = (factions: CardBase['factions']) => {
  const firstColor = FACTION_COLOR_MAP[factions[0]]

  if (factions.length === 1) {
    return firstColor
  }

  return `linear-gradient(300deg, ${firstColor}, ${
    FACTION_COLOR_MAP[factions[1]]
  })`
}

export const createDuelCard = (base: CardBase): DuelCard => ({
  ...base,
  id: generateUUID(),
  strength: base.strength || 0,
  base: {
    strength: base.strength || 0,
    cost: base.cost,
  },
})

export const copyDuelCard = (card: DuelCard): DuelCard => ({
  ...card,
  id: generateUUID(),
})

export const getOnPlayPredicate: GetOnPlayPredicate = (
  action,
  currentState,
  agentName,
) =>
  action.type === 'duel/playCard' &&
  currentState.duel.players[action.payload.playerId].cards[
    action.payload.cardId
  ].name === agentName
