import { Action, ListenerEffect } from '@reduxjs/toolkit'

import { AppDispatch, RootState } from 'src/app/store'
import * as CardEffectPredicates from 'src/features/cards/CardEffectPredicates'
import * as CardEffects from 'src/features/cards/CardEffects'
import { PlayerCardAction } from 'src/features/duel/types'

type CardEffectPredicateName = keyof typeof CardEffectPredicates
type CardEffectName = keyof typeof CardEffects

export type CardEffect<DuelAction extends Action> = ListenerEffect<
  DuelAction,
  RootState,
  AppDispatch
>

export type CardEffectPredicate<DuelAction extends Action> = (
  action: DuelAction,
  currentState: RootState,
) => boolean

type CardRank = 'common' | 'unique'

type CardType = 'agent' | 'instant' | 'location'

export type CardFaction = 'Order' | 'Chaos' | 'Shadow'

export type CardCategory =
  | 'Hammerite'
  | 'Undead'
  | 'Fence'
  | 'Pagan'
  | 'Thief'
  | 'Guard'
  | 'Necromancer'
  | 'Artifact'

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

export interface DuelCard extends CardBase {
  id: string
  strength: number
  base: {
    cost: CardBase['cost']
    strength: CardBase['strength']
  }
}

export interface CardComponentProps {
  card: DuelCard
  isFaceDown?: boolean
  isSmall?: boolean
  isAttacking?: boolean
  isOnTop?: boolean
  onClickCard?: (cardId: DuelCard['id']) => void
}

export type GetOnPlayPredicate = (
  action: PlayerCardAction,
  currentState: RootState,
  cardName: string,
) => boolean
