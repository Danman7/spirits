import { fireEvent } from '@testing-library/dom'
import { RootState } from 'src/app'
import {
  completeRedraw,
  opponentDecidingMessage,
  passButtonMessage,
  redrawMessage,
  resolveTurn,
  skipRedrawLinkMessage,
  yourTurnMessage,
} from 'src/modules/duel'
import { ActionPanel } from 'src/modules/duel/components'
import { opponentId, playerId, stackedStateMock } from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'
import { deepClone } from 'src/shared/utils'

let preloadedState: RootState

beforeEach(() => {
  preloadedState = deepClone(stackedStateMock)
})

it('should show the redraw phase panel with skip redraw link', () => {
  preloadedState.duel.phase = 'Redrawing'

  const { getByText, dispatchSpy } = renderWithProviders(<ActionPanel />, {
    preloadedState,
  })

  expect(getByText(redrawMessage)).toBeInTheDocument()

  fireEvent.click(getByText(skipRedrawLinkMessage))

  expect(dispatchSpy).toHaveBeenCalledWith(completeRedraw({ playerId }))
})

it('should show the waiting for opponent message during redraw phase', () => {
  preloadedState.duel.phase = 'Redrawing'
  preloadedState.duel.players[playerId].hasPerformedAction = true

  const { getByText } = renderWithProviders(<ActionPanel />, {
    preloadedState,
  })

  expect(getByText(opponentDecidingMessage)).toBeInTheDocument()
})

it('should show the your turn message with pass link', () => {
  const { getByText, dispatchSpy } = renderWithProviders(<ActionPanel />, {
    preloadedState,
  })

  expect(getByText(yourTurnMessage)).toBeInTheDocument()

  fireEvent.click(getByText(passButtonMessage))

  expect(dispatchSpy).toHaveBeenCalledWith(resolveTurn())
})

it("should show the waiting for opponent message during opponent's turn", () => {
  preloadedState.duel.playerOrder = [opponentId, playerId]

  const { getByText } = renderWithProviders(<ActionPanel />, {
    preloadedState,
  })

  expect(getByText(opponentDecidingMessage)).toBeInTheDocument()
})
