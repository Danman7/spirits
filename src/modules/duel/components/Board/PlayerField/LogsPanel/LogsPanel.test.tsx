import { fireEvent } from '@testing-library/dom'

import {
  initialDuelStateMock,
  userMock as preloadedUser,
} from 'src/modules/duel/__mocks__'
import { LogsPanel } from 'src/modules/duel/components/Board/PlayerField/LogsPanel'
import {
  hideLogsLink,
  logsTitle,
} from 'src/modules/duel/components/Board/PlayerField/LogsPanel/LogsPanel.messages'
import { renderWithProviders } from 'src/modules/duel/duelTestRender'
import type { DuelState } from 'src/modules/duel/state'

import { deepClone } from 'src/shared/shared.utils'
import { OPEN_LOGS_ICON, PANEL_TEST_ID } from 'src/shared/test/testIds'

let preloadedDuel: DuelState
const logMessage = 'This is a log message'

beforeEach(() => {
  preloadedDuel = deepClone(initialDuelStateMock)
})

it('should be opened by clicking the icon and closed by clicking the hide link', () => {
  preloadedDuel.logs = [<p>{logMessage}</p>]

  const { queryByText, getByText, getByTestId } = renderWithProviders(
    <LogsPanel />,
    { preloadedUser, preloadedDuel },
  )

  expect(queryByText(logsTitle)).toBeFalsy()
  expect(queryByText(logMessage)).toBeFalsy()

  fireEvent.click(getByTestId(OPEN_LOGS_ICON))

  expect(getByText(logsTitle)).toBeTruthy()
  expect(getByText(logMessage)).toBeTruthy()

  fireEvent.click(getByText(hideLogsLink))
  fireEvent.animationEnd(getByTestId(PANEL_TEST_ID))

  expect(queryByText(logsTitle)).toBeFalsy()
  expect(queryByText(logMessage)).toBeFalsy()
})
