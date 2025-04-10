import {
  opponentId,
  playerId,
  stackedDuelStateMock,
  userMock as preloadedUser,
} from 'src/modules/duel/__mocks__'
import { Board } from 'src/modules/duel/components'
import { opponentTurnTitle } from 'src/modules/duel/components/Board/PlayerField/ActionPanel/ActionPanel.messages'
import { logsTitle } from 'src/modules/duel/components/Board/PlayerField/LogsPanel/LogsPanel.messages'
import { normalizeStateCards } from 'src/modules/duel/duel.utils'
import { renderWithProviders } from 'src/modules/duel/duelTestRender'
import { DuelState } from 'src/modules/duel/state'
import {
  agentAttackLogMessage,
  playersTurnLogMessage,
} from 'src/modules/duel/state/playLogs'

import { HammeritePriest } from 'src/shared/modules/cards'
import { deepClone } from 'src/shared/shared.utils'

let preloadedDuel: DuelState

beforeEach(() => {
  jest.useFakeTimers()
  preloadedDuel = deepClone(stackedDuelStateMock)
})

afterEach(() => {
  jest.useRealTimers()
})

it('should resolve turn automatically when selecting a target if there are no valid targets', () => {
  preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
    [playerId]: { board: [], hand: ['HammeritePriest'] },
  })

  const { fireEvent, act, getByText, getByRole } = renderWithProviders(
    <Board />,
    { preloadedUser, preloadedDuel },
  )

  fireEvent.click(getByText(HammeritePriest.name))

  act(() => {
    jest.runAllTimers()
  })

  fireEvent.click(getByText(logsTitle))

  const { cards, players } = preloadedDuel
  const { name: opponentName, board: opponentBoard } = players[opponentId]

  expect(getByRole('log').textContent).toContain(
    `${HammeritePriest.name}${agentAttackLogMessage}${cards[opponentBoard[0]].name}`,
  )

  act(() => {
    jest.runAllTimers()
  })

  expect(getByText(opponentTurnTitle)).toBeTruthy()

  expect(getByRole('log').textContent).toContain(
    `${opponentName}${playersTurnLogMessage}`,
  )
})
