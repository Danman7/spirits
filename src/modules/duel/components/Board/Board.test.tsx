import { fireEvent } from '@testing-library/dom'
import { act } from 'react'
import {
  initialDuelStateMock,
  playerId,
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/__mocks__/duelMocks'
import {
  passButtonMessage,
  skipRedrawLinkMessage,
} from 'src/modules/duel/components/ActionPanel/ActionPanelMessages'
import { Board } from 'src/modules/duel/components/Board'
import { INITIAL_CARDS_DRAWN_IN_DUEL } from 'src/modules/duel/duelConstants'
import { renderWithProviders } from 'src/modules/duel/duelTestRender'
import { normalizeStateCards } from 'src/modules/duel/duelUtils'
import {
  discardLogMessage,
  playerHasDrawnCardLogMessage,
  playerHasSkippedRedrawLogMessage,
  playersTurnLogMessage,
  reduceStrengthLogMessage,
  reducingCoinsLogMessage,
} from 'src/modules/duel/state/duelStateMessages'
import { DuelState } from 'src/modules/duel/state/duelStateTypes'
import { Agent } from 'src/shared/modules/cards/CardTypes'
import { deepClone } from 'src/shared/SharedUtils'
import {
  CARD_TEST_ID,
  LOGS_CONTENT,
  OPEN_LOGS_ICON,
  OVERLAY_TEST_ID,
} from 'src/shared/test/testIds'

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
    preloadedDuel = normalizeStateCards(initialDuelStateMock, {
      [playerId]: {
        hand: ['HammeriteNovice', 'TempleGuard'],
        deck: ['BrotherSachelman', 'YoraSkull'],
      },
    })

    preloadedDuel.phase = 'Redrawing'
  })

  it('should be able to redraw a card', () => {
    const { queryByText, getByText, getByTestId } = renderWithProviders(
      <Board />,
      {
        preloadedUser,
        preloadedDuel,
      },
    )

    const { hand, deck, name } = preloadedDuel.players[playerId]
    const replacedCardName = preloadedDuel.cards[hand[0]].name
    const redrawnCardName = preloadedDuel.cards[deck[0]].name
    const advanceTurnDrawnCardName = preloadedDuel.cards[deck[1]].name

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

    const { deck, name } = preloadedDuel.players[playerId]

    const drawnCardName = preloadedDuel.cards[deck[0]].name

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
    const { board } = players[playerOrder[1]]
    const { name, strength } = preloadedDuel.cards[board[0]] as Agent

    expect(getByTestId(`${CARD_TEST_ID}${board[0]}`).textContent).toContain(
      `${name}${strength - 1}`,
    )

    fireEvent.click(getByTestId(OPEN_LOGS_ICON))

    expect(getByTestId(LOGS_CONTENT).textContent).toContain(
      `${name}${reduceStrengthLogMessage}${strength - 1}`,
    )
  })

  it('should discard an instant when played', () => {
    const { getByText, queryByText, getByTestId } = renderWithProviders(
      <Board />,
      {
        preloadedUser,
        preloadedDuel,
      },
    )

    const {
      players,
      playerOrder: [activePlayerId],
      cards,
    } = preloadedDuel
    const { discard, hand, board } = players[activePlayerId]
    const playerCardName = cards[hand[1]].name

    fireEvent.click(getByText(playerCardName))

    expect(queryByText(playerCardName)).toBeFalsy()

    expect(getByTestId(`${playerId}-discard`).children).toHaveLength(
      discard.length + 1,
    )
    expect(getByTestId(`${playerId}-board`).children).toHaveLength(board.length)
    expect(getByTestId(`${playerId}-hand`).children).toHaveLength(
      hand.length - 1,
    )
    expect(getByTestId(`${playerId}-hand`).textContent).not.toContain(
      playerCardName,
    )

    fireEvent.click(getByTestId(OPEN_LOGS_ICON))

    expect(getByTestId(LOGS_CONTENT).textContent).toContain(
      `${playerCardName}${discardLogMessage}`,
    )
  })
})
