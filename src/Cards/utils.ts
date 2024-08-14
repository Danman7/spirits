import {
  BOTTOM_BOARD_ELEMENT_ID,
  BOTTOM_HAND_ELEMENT_ID,
  TOP_BOARD_ELEMENT_ID,
  TOP_HAND_ELEMENT_ID
} from '../Game/constants'
import { generateUUID } from '../utils/gameUtils'
import { CardState } from './components/types'
import { FACTION_COLOR_MAP } from './constants'
import { Card, PlayCard } from './types'

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

export const getCoinsMessage = (coins: number) =>
  `${coins} ${coins > 1 ? 'coins' : 'coin'}`

export const createPlayCardFromPrototype = (
  cardPrototype: Card,
  cardState?: CardState
): PlayCard => {
  const prototype: PlayCard['prototype'] = {
    cost: cardPrototype.cost
  }

  if (cardPrototype.strength) {
    prototype.strength = cardPrototype.strength
  }

  return {
    ...cardPrototype,
    id: generateUUID(),
    prototype,
    state: cardState || CardState.InHand
  }
}

export const getCardPortalElements = (
  cardState: CardState,
  isPlayerCard?: boolean
): HTMLElement => {
  const bottomHand = document.getElementById(
    BOTTOM_HAND_ELEMENT_ID
  ) as HTMLElement

  const bottomBoard = document.getElementById(
    BOTTOM_BOARD_ELEMENT_ID
  ) as HTMLElement

  const topBoard = document.getElementById(TOP_BOARD_ELEMENT_ID) as HTMLElement

  const topHand = document.getElementById(TOP_HAND_ELEMENT_ID) as HTMLElement

  if (isPlayerCard && cardState === CardState.InHand && bottomHand) {
    return bottomHand
  }

  if (isPlayerCard && cardState === CardState.OnBoard && bottomBoard) {
    return bottomBoard
  }

  if (!isPlayerCard && cardState === CardState.InHand && topHand) {
    return topHand
  }

  if (!isPlayerCard && cardState === CardState.OnBoard && topBoard) {
    return topBoard
  }

  return document.body
}
