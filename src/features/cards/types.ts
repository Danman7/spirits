import { Action, ListenerEffect } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/app/store'
import { DuelActionTypes } from 'src/features/duel/slice'
import * as CardEffects from 'src/features/cards/CardEffects'

type CardEffectName = keyof typeof CardEffects

export type CardEffect<DuelAction extends Action> = ListenerEffect<
  DuelAction,
  RootState,
  AppDispatch
>

export interface Card {
  readonly name: string
  cost: number
  factions: CardFaction[]
  types: CardType[]
  strength: number
  description: string[]
  flavor?: string
  trigger?: {
    type: DuelActionTypes
    effect: CardEffectName
    condition?: EffectCondition
  }
}

export interface PlayCard extends Card {
  id: string
  prototype: {
    strength: Card['strength']
    cost: Card['cost']
  }
}

export type CardFaction = 'Order' | 'Chaos' | 'Shadow'

export type CardType =
  | 'Hammerite'
  | 'Undead'
  | 'Fence'
  | 'Pagan'
  | 'Thief'
  | 'Guard'
  | 'Necromancer'
  | 'Artifact'

export interface CardProps {
  card: PlayCard
  isFaceDown?: boolean
  isSmall?: boolean
  onClickCard?: (cardId: PlayCard['id']) => void
}

export type EffectCondition = 'Action should have card id'
