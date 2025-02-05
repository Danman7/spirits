import { fireEvent } from '@testing-library/dom'
import { act } from 'react'
import { RootState } from 'src/app'
import {
  endDuel,
  moveToNextTurn,
  playersDrawInitialCards,
  startFirstPlayerTurn,
  victoryMessage,
  yourTurnMessage,
} from 'src/modules/duel'
import { Board } from 'src/modules/duel/components'
import { opponentId, playerId, stackedStateMock } from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'
import { OVERLAY_TEST_ID } from 'src/shared/testIds'
import { deepClone } from 'src/shared/utils'

let preloadedState: RootState

beforeEach(() => {
  preloadedState = deepClone(stackedStateMock)
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
  preloadedState.duel.players[playerId].hasPerformedAction = true
  preloadedState.duel.players[opponentId].hasPerformedAction = true

  const { dispatchSpy } = renderWithProviders(<Board />, {
    preloadedState,
  })

  expect(dispatchSpy).toHaveBeenCalledWith(startFirstPlayerTurn())
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

it('should hide the action panel if the user performs an action', () => {
  preloadedState.duel.players[
    preloadedState.duel.playerOrder[0]
  ].hasPerformedAction = true

  const { queryByText } = renderWithProviders(<Board />, {
    preloadedState,
  })

  expect(queryByText(yourTurnMessage)).not.toBeInTheDocument()
})
