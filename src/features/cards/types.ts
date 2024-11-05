import { Action, ListenerEffect } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/app/store'
import * as CardEffectPredicates from 'src/features/cards/CardEffectPredicates'
import * as CardEffects from 'src/features/cards/CardEffects'

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

export interface CardBase {
  readonly name: string
  cost: number
  factions: CardFaction[]
  types: CardType[]
  description: string[]
  flavor?: string
  trigger?: {
    predicate: CardEffectPredicateName
    effect: CardEffectName
  }
}

export interface Agent extends CardBase {
  kind: 'agent'
  strength: number
}

export interface Instant extends CardBase {
  kind: 'instant'
}

export type DuelInstant = Instant & {
  id: string
  prototype: {
    cost: number
  }
}

export type DuelAgent = Agent & {
  id: string
  prototype: {
    strength: number
    cost: number
  }
}

export type PlayCard = DuelInstant | DuelAgent

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

export interface CardComponentProps {
  card: PlayCard
  isFaceDown?: boolean
  isSmall?: boolean
  isAttacking?: boolean
  isOnTop?: boolean
  onClickCard?: (cardId: PlayCard['id']) => void
}
