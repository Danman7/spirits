import { fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { RootState } from 'src/app/store'
import { ActionPanel } from 'src/modules/duel/components'
import {
  opponentDecidingMessage,
  passButtonMessage,
  redrawMessage,
  skipRedrawLinkMessage,
  yourTurnMessage,
} from 'src/modules/duel/messages'
import { completeRedraw, resolveTurn } from 'src/modules/duel/slice'
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

  expect(dispatchSpy).toHaveBeenCalledWith(completeRedraw(playerId))
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
  preloadedState.duel.activePlayerId = opponentId

  const { getByText } = renderWithProviders(<ActionPanel />, {
    preloadedState,
  })

  expect(getByText(opponentDecidingMessage)).toBeInTheDocument()
})
