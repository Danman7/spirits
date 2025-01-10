import { fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom'

import { RootState } from 'src/app/store'
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
import { completeRedraw, initializeEndTurn } from 'src/features/duel/slice'
import { Player } from 'src/features/duel/types'
import { MockPlayerTurnState, playerId } from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'

const mockPlayer: Player = MockPlayerTurnState.players[playerId]

const defaultProps: ActionPanelProps = {
  isOpen: true,
  loggedInPlayer: mockPlayer,
  isLoggedInPlayerActive: true,
  phase: 'Initial Draw',
}

const preloadedState: Partial<RootState> = {
  duel: MockPlayerTurnState,
}

it('should show the redraw phase panel with skip redraw link', () => {
  const { getByText, dispatchSpy } = renderWithProviders(
    <ActionPanel {...defaultProps} phase="Redrawing Phase" />,
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
      phase="Redrawing Phase"
      loggedInPlayer={{ ...mockPlayer, hasPerformedAction: true }}
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

  expect(dispatchSpy).toHaveBeenCalledWith(initializeEndTurn())
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
