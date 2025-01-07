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

export type GetOnPlayPredicate = (
  action: PlayerCardAction,
  currentState: RootState,
  cardName: string,
) => boolean
