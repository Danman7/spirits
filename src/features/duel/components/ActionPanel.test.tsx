import { fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom'

import {
  ActionPanel,
  ActionPanelProps,
} from 'src/features/duel/components/ActionPanel'
import {
  opponentDecidingMessage,
  passButtonMessage,
  redrawMessage,
  skipRedrawLinkMessage,
  yourTurnMessage,
} from 'src/features/duel/messages'
import { completeRedraw, resolveTurn } from 'src/features/duel/slice'

import {
  playerId,
  stackedPreloadedState as preloadedState,
  stackedPlayerMock as loggedInPlayer,
} from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'

const defaultProps: ActionPanelProps = {
  isOpen: true,
  loggedInPlayer,
  isLoggedInPlayerActive: true,
  phase: 'Initial Draw',
}

it('should show the redraw phase panel with skip redraw link', () => {
  const { getByText, dispatchSpy } = renderWithProviders(
    <ActionPanel {...defaultProps} phase="Redrawing" />,
    {
      preloadedState,
    },
  )

  expect(getByText(redrawMessage)).toBeInTheDocument()

  fireEvent.click(getByText(skipRedrawLinkMessage))

  expect(dispatchSpy).toHaveBeenCalledWith(completeRedraw(playerId))
})

it('should show the waiting for opponent message during redraw phase', () => {
  const { getByText } = renderWithProviders(
    <ActionPanel
      {...defaultProps}
      phase="Redrawing"
      loggedInPlayer={{ ...loggedInPlayer, hasPerformedAction: true }}
    />,
    {
      preloadedState,
    },
  )

  expect(getByText(opponentDecidingMessage)).toBeInTheDocument()
})

it('should show the your turn message with pass link', () => {
  const { getByText, dispatchSpy } = renderWithProviders(
    <ActionPanel {...defaultProps} phase="Player Turn" />,
    {
      preloadedState,
    },
  )

  expect(getByText(yourTurnMessage)).toBeInTheDocument()

  fireEvent.click(getByText(passButtonMessage))

  expect(dispatchSpy).toHaveBeenCalledWith(resolveTurn())
})

it("should show the waiting for opponent message during opponent's turn", () => {
  const { getByText } = renderWithProviders(
    <ActionPanel
      {...defaultProps}
      phase="Player Turn"
      isLoggedInPlayerActive={false}
    />,
    {
      preloadedState,
    },
  )

  expect(getByText(opponentDecidingMessage)).toBeInTheDocument()
})
