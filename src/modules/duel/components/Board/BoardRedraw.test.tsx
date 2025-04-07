import {
  initialDuelStateWithBotMock,
  opponentId,
  playerId,
  userMock as preloadedUser,
} from 'src/modules/duel/__mocks__'
import { Board } from 'src/modules/duel/components'
import {
  opponentDecidingMessage,
  redrawingtitle,
  redrawMessage,
  skipRedrawLinkMessage,
} from 'src/modules/duel/components/Board/PlayerField/ActionPanel/ActionPanel.messages'
import { logsTitle } from 'src/modules/duel/components/Board/PlayerField/LogsPanel/LogsPanel.messages'
import { normalizeStateCards } from 'src/modules/duel/duel.utils'
import { renderWithProviders } from 'src/modules/duel/duelTestRender'
import { DuelState } from 'src/modules/duel/state'
import {
  playerHasDrawnCardLogMessage,
  playerHasSkippedRedrawLogMessage,
  playersTurnLogMessage,
} from 'src/modules/duel/state/playLogs'

let preloadedDuel: DuelState

beforeEach(() => {
  jest.useFakeTimers()

  preloadedDuel = normalizeStateCards(initialDuelStateWithBotMock, {
    [playerId]: {
      hand: ['HammeriteNovice', 'TempleGuard'],
      deck: ['BrotherSachelman', 'YoraSkull'],
    },
  })

  preloadedDuel.phase = 'Redrawing'
})

afterEach(() => {
  jest.useRealTimers()
})

it('should show redrawing phase action panel', () => {
  const { getByText } = renderWithProviders(<Board />, {
    preloadedUser,
    preloadedDuel,
  })

  expect(getByText(redrawingtitle)).toBeTruthy()
  expect(getByText(redrawMessage, { exact: false })).toBeTruthy()
  expect(getByText(skipRedrawLinkMessage)).toBeTruthy()
})

it('should be able to redraw a card', () => {
  const { fireEvent, act, queryByText, getByText, getByRole } =
    renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

  const { hand, deck, name } = preloadedDuel.players[playerId]
  const replacedCardName = preloadedDuel.cards[hand[0]].name
  const redrawnCardName = preloadedDuel.cards[deck[0]].name
  const advanceTurnDrawnCardName = preloadedDuel.cards[deck[1]].name

  expect(getByText(replacedCardName)).toBeTruthy()
  expect(queryByText(redrawnCardName)).toBeFalsy()

  fireEvent.click(getByText(replacedCardName))

  act(() => {
    jest.runAllTimers()
  })

  expect(queryByText(replacedCardName)).toBeFalsy()

  expect(getByText(redrawnCardName)).toBeTruthy()
  expect(getByText(advanceTurnDrawnCardName)).toBeTruthy()

  fireEvent.click(getByText(logsTitle))

  expect(getByRole('log').textContent).toContain(
    `${name}${playerHasDrawnCardLogMessage}`,
  )
  expect(getByRole('log').textContent).toContain(
    `${preloadedDuel.players[opponentId].name}${playerHasSkippedRedrawLogMessage}`,
  )
  expect(getByRole('log').textContent).toContain(
    `${name}${playersTurnLogMessage}`,
  )
})

it('should be able to skip redraw', async () => {
  const { fireEvent, act, queryByText, getByText, getByRole } =
    renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

  const { deck, name } = preloadedDuel.players[playerId]
  const drawnCardName = preloadedDuel.cards[deck[0]].name

  expect(queryByText(drawnCardName)).toBeFalsy()

  fireEvent.click(getByText(skipRedrawLinkMessage))

  act(() => {
    jest.runAllTimers()
  })

  expect(queryByText(drawnCardName)).toBeTruthy()

  fireEvent.click(getByText(logsTitle))

  expect(getByRole('log').textContent).toContain(
    `${preloadedDuel.players[opponentId].name}${playerHasSkippedRedrawLogMessage}`,
  )
  expect(getByRole('log').textContent).toContain(
    `${name}${playerHasSkippedRedrawLogMessage}`,
  )
  expect(getByRole('log').textContent).toContain(
    `${name}${playersTurnLogMessage}`,
  )
})

it('should show if waiting for the opponent to redraw', () => {
  preloadedDuel.players[opponentId].isBot = false

  const { fireEvent, getByText } = renderWithProviders(<Board />, {
    preloadedUser,
    preloadedDuel,
  })

  const { hand } = preloadedDuel.players[playerId]
  const replacedCardName = preloadedDuel.cards[hand[0]].name

  fireEvent.click(getByText(replacedCardName))

  expect(getByText(redrawingtitle)).toBeTruthy()
  expect(getByText(opponentDecidingMessage)).toBeTruthy()
})
