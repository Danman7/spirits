import { clearAllListeners } from '@reduxjs/toolkit'
import { fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { act } from 'react'

import { addAppListener } from 'src/app/listenerMiddleware'
import { RootState } from 'src/app/store'
import * as CardEffectPredicates from 'src/features/cards/CardEffectPredicates'
import * as CardEffects from 'src/features/cards/CardEffects'
import {
  CardEffectName,
  CardEffectPredicateName,
} from 'src/features/cards/types'
import Board from 'src/features/duel/components/Board'
import { playersDrawInitialCards } from 'src/features/duel/slice'
import {
  playerId,
  stackedPlayerMock,
  stackedPreloadedState,
} from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'
import { OVERLAY_TEST_ID, PANEL_TEST_ID } from 'src/shared/testIds'

let preloadedState: RootState

beforeEach(() => {
  preloadedState = { ...stackedPreloadedState }
})

it('should add card effect listeners on mount', () => {
  const { dispatchSpy } = renderWithProviders(<Board />, {
    preloadedState,
  })

  const cardWithTrigger = stackedPlayerMock.cards[stackedPlayerMock.deck[0]]

  expect(dispatchSpy).toHaveBeenCalledWith(clearAllListeners())
  expect(dispatchSpy).toHaveBeenCalledWith(
    addAppListener({
      predicate:
        CardEffectPredicates[
          cardWithTrigger.trigger?.predicate as CardEffectPredicateName
        ],
      effect: CardEffects[cardWithTrigger.trigger?.effect as CardEffectName],
    }),
  )
})

it('should initiate card drawing', async () => {
  preloadedState.duel = { ...preloadedState.duel, phase: 'Initial Draw' }

  const { getByTestId, dispatchSpy } = renderWithProviders(<Board />, {
    preloadedState,
  })

  await act(async () => {
    await new Promise((r) => setTimeout(r, 2500))
  })

  fireEvent.animationEnd(getByTestId(OVERLAY_TEST_ID))

  expect(dispatchSpy).toHaveBeenCalledWith(playersDrawInitialCards())
})

it('should hide the side panel if the logged in player has performed an action', () => {
  preloadedState.duel.players[playerId] = {
    ...preloadedState.duel.players[playerId],
    hasPerformedAction: true,
  }

  const { queryByTestId } = renderWithProviders(<Board />, { preloadedState })

  expect(queryByTestId(PANEL_TEST_ID)).not.toBeInTheDocument()
})
