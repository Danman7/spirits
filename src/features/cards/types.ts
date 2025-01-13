import { Action, ListenerEffect } from '@reduxjs/toolkit'

import { AppDispatch, RootState } from 'src/app/store'
import { PlayerCardAction } from 'src/features/duel/types'

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
