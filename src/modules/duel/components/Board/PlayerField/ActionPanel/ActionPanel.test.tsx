import { fireEvent } from '@testing-library/dom'

import {
  initialDuelStateMock,
  userMock as preloadedUser,
} from 'src/modules/duel/__mocks__'
import { ActionPanel } from 'src/modules/duel/components/Board/PlayerField/ActionPanel/ActionPanel'
import {
  opponentDecidingMessage,
  opponentTurnTitle,
  passButtonMessage,
  redrawingtitle,
  redrawMessage,
  skipRedrawLinkMessage,
  yourTurnMessage,
  yourTurnTitle,
} from 'src/modules/duel/components/Board/PlayerField/ActionPanel/ActionPanel.messages'
import { renderWithProviders } from 'src/modules/duel/duelTestRender'
import { DuelState } from 'src/modules/duel/state'

import { deepClone } from 'src/shared/shared.utils'
import { PANEL_TEST_ID } from 'src/shared/test/testIds'

let preloadedDuel: DuelState

beforeEach(() => {
  preloadedDuel = deepClone(initialDuelStateMock)
})

it('should show proper content for redrawing phase', () => {
  preloadedDuel.phase = 'Redrawing'

  const { getByText, getByTestId } = renderWithProviders(<ActionPanel />, {
    preloadedUser,
    preloadedDuel,
  })

  expect(getByText(redrawingtitle)).toBeTruthy()
  expect(getByText(skipRedrawLinkMessage)).toBeTruthy()
  expect(getByTestId(PANEL_TEST_ID).textContent).toContain(redrawMessage)
})

it('should be able to skip redraw', () => {
  preloadedDuel.phase = 'Redrawing'

  const { getByText } = renderWithProviders(<ActionPanel />, {
    preloadedUser,
    preloadedDuel,
  })

  fireEvent.click(getByText(skipRedrawLinkMessage))

  expect(getByText(redrawingtitle)).toBeTruthy()
  expect(getByText(opponentDecidingMessage)).toBeTruthy()
})

it("should show when it's the player's turn and he hasn't performed an action", () => {
  preloadedDuel.phase = 'Player Turn'

  const { getByTestId, getByText } = renderWithProviders(<ActionPanel />, {
    preloadedUser,
    preloadedDuel,
  })

  expect(getByText(yourTurnTitle)).toBeTruthy()
  expect(getByTestId(PANEL_TEST_ID).textContent).toContain(yourTurnMessage)
  expect(getByText(passButtonMessage)).toBeTruthy()
})

it('should be able to pass the turn', () => {
  preloadedDuel.phase = 'Player Turn'

  const { getByText, getByTestId, queryByTestId } = renderWithProviders(
    <ActionPanel />,
    { preloadedUser, preloadedDuel },
  )

  fireEvent.click(getByText(passButtonMessage))
  fireEvent.animationEnd(getByTestId(PANEL_TEST_ID))

  expect(queryByTestId(PANEL_TEST_ID)?.textContent).toContain('...')
})

it("should show when it's the opponent's turn", () => {
  preloadedDuel.phase = 'Player Turn'
  preloadedDuel.playerOrder = preloadedDuel.playerOrder.reverse() as [
    string,
    string,
  ]

  const { getByText } = renderWithProviders(<ActionPanel />, {
    preloadedUser,
    preloadedDuel,
  })

  expect(getByText(opponentTurnTitle)).toBeTruthy()
  expect(getByText(opponentDecidingMessage)).toBeTruthy()
})
