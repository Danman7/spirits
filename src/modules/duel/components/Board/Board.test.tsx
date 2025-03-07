import { fireEvent } from '@testing-library/dom'
import { act } from 'react'
import {
  initialDuelStateMock,
  playerId,
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/__mocks__/DuelMocks'
import {
  passButtonMessage,
  skipRedrawLinkMessage,
} from 'src/modules/duel/components/ActionPanel/ActionPanelMessages'
import { Board } from 'src/modules/duel/components/Board'
import { INITIAL_CARDS_DRAWN_IN_DUEL } from 'src/modules/duel/constants'
import {
  playerHasDrawnCardLogMessage,
  playerHasSkippedRedrawLogMessage,
  playersTurnLogMessage,
  reduceStrengthLogMessage,
  reducingCoinsLogMessage,
} from 'src/modules/duel/state/DuelStateMessages'
import { renderWithProviders } from 'src/modules/duel/DuelTestRender'
import { DuelState } from 'src/modules/duel/DuelTypes'
import { normalizePlayerCards } from 'src/modules/duel/DuelUtils'
import { Agent } from 'src/shared/modules/cards/CardTypes'
import {
  CARD_TEST_ID,
  LOGS_CONTENT,
  OPEN_LOGS_ICON,
  OVERLAY_TEST_ID,
} from 'src/shared/test/testIds'
import { deepClone } from 'src/shared/SharedUtils'

jest.useFakeTimers()

let preloadedDuel: DuelState

it('should not render board if no duel is initiated', () => {
  const { queryByTestId } = renderWithProviders(<Board />)

  expect(queryByTestId(OVERLAY_TEST_ID)).toBeFalsy()
})

describe('Setup', () => {
  beforeEach(() => {
    preloadedDuel = deepClone(initialDuelStateMock)
  })

  it(`should draw exactly ${INITIAL_CARDS_DRAWN_IN_DUEL} cards on starting the duel`, () => {
    const { getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    act(() => {
      jest.runAllTimers()
    })

    fireEvent.animationEnd(getByTestId(OVERLAY_TEST_ID))

    preloadedDuel.playerOrder.forEach((playerId) => {
      expect(getByTestId(`${playerId}-hand`).children).toHaveLength(
        INITIAL_CARDS_DRAWN_IN_DUEL,
      )

      expect(getByTestId(`${playerId}-deck`).children).toHaveLength(
        preloadedDuel.players[playerId].deck.length -
          INITIAL_CARDS_DRAWN_IN_DUEL,
      )
    })
  })
})

describe('Redrawing', () => {
  beforeEach(() => {
    preloadedDuel = deepClone(initialDuelStateMock)

    preloadedDuel.phase = 'Redrawing'
    preloadedDuel.players[playerId] = {
      ...preloadedDuel.players[playerId],
      ...normalizePlayerCards({
        hand: ['HammeriteNovice', 'TempleGuard'],
        deck: ['BrotherSachelman', 'YoraSkull'],
      }),
    }
  })

  it('should be able to redraw a card', () => {
    const { queryByText, getByText, getByTestId } = renderWithProviders(
      <Board />,
      {
        preloadedUser,
        preloadedDuel,
      },
    )

    const { cards, hand, deck, name } = preloadedDuel.players[playerId]
    const replacedCardName = cards[hand[0]].name
    const redrawnCardName = cards[deck[0]].name
    const advanceTurnDrawnCardName = cards[deck[1]].name

    expect(getByText(replacedCardName)).toBeTruthy()
    expect(queryByText(redrawnCardName)).toBeFalsy()

    fireEvent.click(getByText(replacedCardName))

    expect(queryByText(replacedCardName)).toBeFalsy()
    expect(getByText(redrawnCardName)).toBeTruthy()
    expect(getByText(advanceTurnDrawnCardName)).toBeTruthy()

    fireEvent.click(getByTestId(OPEN_LOGS_ICON))

    expect(getByTestId(LOGS_CONTENT).textContent).toContain(
      `${name}${playerHasDrawnCardLogMessage}`,
    )
  })

  it('should be able to skip redraw', () => {
    const { queryByText, getByText, getByTestId } = renderWithProviders(
      <Board />,
      {
        preloadedUser,
        preloadedDuel,
      },
    )

    const { cards, deck, name } = preloadedDuel.players[playerId]

    const drawnCardName = cards[deck[0]].name

    expect(queryByText(drawnCardName)).toBeFalsy()

    fireEvent.click(getByText(skipRedrawLinkMessage))

    expect(getByText(drawnCardName)).toBeTruthy()

    fireEvent.click(getByTestId(OPEN_LOGS_ICON))

    expect(getByTestId(LOGS_CONTENT).textContent).toContain(
      `${name}${playerHasSkippedRedrawLogMessage}`,
    )
    expect(getByTestId(LOGS_CONTENT).textContent).toContain(
      `${name}${playersTurnLogMessage}`,
    )
  })
})

describe('Player Turns', () => {
  beforeEach(() => {
    preloadedDuel = deepClone(stackedDuelStateMock)
  })

  it('should attack player with an agent if opponent board is empty', () => {
    const { playerOrder } = preloadedDuel
    const defenderId = playerOrder[1]

    preloadedDuel.players[defenderId].board = []

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(passButtonMessage))

    const { players } = preloadedDuel
    const { name, coins } = players[defenderId]

    expect(getByTestId(`${defenderId}-info`).textContent).toContain(
      `${name} / ${coins - 1}`,
    )

    fireEvent.click(getByTestId(OPEN_LOGS_ICON))

    expect(getByTestId(LOGS_CONTENT).textContent).toContain(
      `${name}${reducingCoinsLogMessage}${coins - 1}`,
    )
  })

  it('should attack an agent with an agent if the board is not empty', () => {
    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(passButtonMessage))

    const { players, playerOrder } = preloadedDuel
    const { board, cards } = players[playerOrder[1]]
    const { name, strength } = cards[board[0]] as Agent

    expect(getByTestId(`${CARD_TEST_ID}${board[0]}`).textContent).toContain(
      `${name}${strength - 1}`,
    )

    fireEvent.click(getByTestId(OPEN_LOGS_ICON))

    expect(getByTestId(LOGS_CONTENT).textContent).toContain(
      `${name}${reduceStrengthLogMessage}${strength - 1}`,
    )
  })
})
