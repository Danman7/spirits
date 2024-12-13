import { Action, ListenerEffect } from '@reduxjs/toolkit'

import { AppDispatch, RootState } from 'src/app/store'
import * as CardEffectPredicates from 'src/features/cards/CardEffectPredicates'
import * as CardEffects from 'src/features/cards/CardEffects'
import { PlayerCardAction } from 'src/features/duel/types'

export type CardEffectPredicateName = keyof typeof CardEffectPredicates
export type CardEffectName = keyof typeof CardEffects

/**
 * This is a typed replica of redux toolkit ListenerPredicate method which determines when an effect takes place.
 */
export type CardEffectPredicate<DuelAction extends Action> = (
  action: DuelAction,
  currentState: RootState,
) => boolean

/**
 * This extends redux toolkit’s ListenerEffect with types triggering card actions at various points in a duel.
 */
export type CardEffect<DuelAction extends Action> = ListenerEffect<
  DuelAction,
  RootState,
  AppDispatch
>

/**
 * A card’s rank controls how many copies of a card one can have in a deck. Sometimes it also directs card effects.
 */
type CardRank = 'common' | 'unique'

/**
 * A card’s type decides how it is played and removed from the board.
 */
type CardType = 'agent' | 'instant' | 'location'

/**
 * A card may belong to one or multiple factions. This plays a role in deck building determining which cards can go together. A card may also belong to no faction, being neutral, and can be mixed with cards from any faction.
 */
export type CardFaction = 'Order' | 'Chaos' | 'Shadow'

/**
 * A card can have one or multiple categories which are considered for card effects.
 */
export type CardCategory =
  | 'Hammerite'
  | 'Undead'
  | 'Fence'
  | 'Pagan'
  | 'Thief'
  | 'Guard'
  | 'Necromancer'
  | 'Artifact'

/**
 * Represents a base card object which is used to create instances of this card.
 */
export interface CardBase {
  readonly name: string
  cost: number
  strength?: number
  factions: CardFaction[]
  categories: CardCategory[]
  type: CardType
  rank: CardRank
  description: string[]
  flavor?: string
  trigger?: {
    predicate: CardEffectPredicateName
    effect: CardEffectName
  }
}

/**
 *  A ready for duel card object with unique id and base properties for reference.
 */
export interface DuelCard extends CardBase {
  id: string
  strength: number
  base: {
    cost: number
    strength: number
  }
}

export type GetOnPlayPredicate = (
  action: PlayerCardAction,
  currentState: RootState,
  cardName: string,
) => boolean
