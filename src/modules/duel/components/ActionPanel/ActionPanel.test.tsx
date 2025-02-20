import { fireEvent } from '@testing-library/dom'
import {
  DuelState,
  opponentDecidingMessage,
  opponentTurnTitle,
  passButtonMessage,
  redrawingtitle,
  redrawMessage,
  renderWithProviders,
  skipRedrawLinkMessage,
  yourTurnMessage,
  yourTurnTitle,
} from 'src/modules/duel'
import { ActionPanel } from 'src/modules/duel/components'
import {
  initialDuelStateMock,
  userMock as preloadedUser,
} from 'src/shared/__mocks__'
import { PANEL_TEST_ID } from 'src/shared/test'
import { deepClone } from 'src/shared/utils'

let preloadedDuel: DuelState

beforeEach(() => {
  preloadedDuel = deepClone(initialDuelStateMock)
})

it('should show when the phase is Redrawing', () => {
  preloadedDuel.phase = 'Redrawing'

  const { getByText } = renderWithProviders(<ActionPanel />, {
    preloadedUser,
    preloadedDuel,
  })

  expect(getByText(redrawingtitle)).toBeTruthy()
  expect(getByText(redrawMessage)).toBeTruthy()
  expect(getByText(skipRedrawLinkMessage)).toBeTruthy()
})

it('should be able to skip redrawing', () => {
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

  const { getByText } = renderWithProviders(<ActionPanel />, {
    preloadedUser,
    preloadedDuel,
  })

  expect(getByText(yourTurnTitle)).toBeTruthy()
  expect(getByText(yourTurnMessage)).toBeTruthy()
  expect(getByText(passButtonMessage)).toBeTruthy()
})

it('should be able to pass the turn', () => {
  preloadedDuel.phase = 'Player Turn'

  const { getByText, getByTestId, queryByTestId } = renderWithProviders(
    <ActionPanel />,
    {
      preloadedUser,
      preloadedDuel,
    },
  )

  fireEvent.click(getByText(passButtonMessage))
  fireEvent.animationEnd(getByTestId(PANEL_TEST_ID))

  expect(queryByTestId(PANEL_TEST_ID)).toBeFalsy()
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
