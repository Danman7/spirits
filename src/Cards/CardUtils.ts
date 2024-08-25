import { Dispatch } from '@reduxjs/toolkit'

import { FACTION_COLOR_MAP } from 'src/Cards/constants'
import { Card, CardType, PlayCard } from 'src/Cards/CardTypes'
import { GameActions } from 'src/Game/GameSlice'
import { generateUUID } from 'src/shared/utils/utils'

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

export const createPlayCardFromPrototype = (cardPrototype: Card): PlayCard => {
  const prototype: PlayCard['prototype'] = {
    cost: cardPrototype.cost
  }

  if (cardPrototype.strength) {
    prototype.strength = cardPrototype.strength
  }

  return {
    ...cardPrototype,
    id: generateUUID(),
    prototype
  }
}

export const checkForImplicitOnPlay = (card: PlayCard, dispatch: Dispatch) => {
  const { types } = card

  if (types.includes(CardType.Necromancer)) {
    dispatch(GameActions.triggerCardAbility('NecromancerOnPlay'))
  }
}
