import { fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { act } from 'react'

import { RootState } from 'src/app/store'
import { Board } from 'src/features/duel/components/Board'
import { victoryMessage } from 'src/features/duel/messages'
import {
  endDuel,
  moveToNextTurn,
  playersDrawInitialCards,
} from 'src/features/duel/slice'
import {
  initialOpponentMock,
  initialPlayerMock,
  opponentId,
  playerId,
  stackedPreloadedState,
} from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'
import { OVERLAY_TEST_ID } from 'src/shared/testIds'
import { deepClone } from 'src/shared/utils'

let preloadedState: RootState

beforeEach(() => {
  preloadedState = deepClone(stackedPreloadedState)
})

it('should initiate card drawing', async () => {
  preloadedState.duel.phase = 'Initial Draw'

  const { getByTestId, dispatchSpy } = renderWithProviders(<Board />, {
    preloadedState,
  })

  await act(async () => {
    await new Promise((r) => setTimeout(r, 2500))
  })

  fireEvent.animationEnd(getByTestId(OVERLAY_TEST_ID))

  expect(dispatchSpy).toHaveBeenCalledWith(playersDrawInitialCards())
})

it('should begin the player turn if both players have completed redraw', () => {
  preloadedState.duel.phase = 'Redrawing'
  preloadedState.duel.players[playerId] = {
    ...initialPlayerMock,
    hasPerformedAction: true,
  }
  preloadedState.duel.players[opponentId] = {
    ...initialOpponentMock,
    hasPerformedAction: true,
  }

  const { dispatchSpy } = renderWithProviders(<Board />, {
    preloadedState,
  })

  expect(dispatchSpy).toHaveBeenCalledWith(moveToNextTurn())
})

it('should move to next round if there is no agent on board for the active player', () => {
  preloadedState.duel.phase = 'Resolving turn'

  const { dispatchSpy } = renderWithProviders(<Board />, {
    preloadedState,
  })

  expect(dispatchSpy).toHaveBeenCalledWith(moveToNextTurn())
})

it('should show the end duel modal if one of the players has no coins', () => {
  preloadedState.duel.players[playerId].coins = 0

  const { getByText, dispatchSpy } = renderWithProviders(<Board />, {
    preloadedState,
  })

  expect(dispatchSpy).toHaveBeenCalledWith(endDuel(opponentId))
  expect(
    getByText(
      `${preloadedState.duel.players[opponentId].name} ${victoryMessage}`,
    ),
  )
})
