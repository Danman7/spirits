import {
  initialDuelStateMock,
  playerId,
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/modules/duel/__mocks__'
import { Board } from 'src/modules/duel/components/Board/Board'
import {
  firstPlayerMessage,
  versusMessage,
} from 'src/modules/duel/components/Board/DuelModal/DuelModal.messages'
import { stackMessageMap } from 'src/modules/duel/components/Board/PlayerField/CardStackList'
import {
  browsingStackModalTitle,
  closeMessage,
  deckLabel,
  incomeLabel,
} from 'src/modules/duel/components/Board/PlayerField/PlayerField.messages'
import { INITIAL_CARDS_DRAWN_IN_DUEL } from 'src/modules/duel/duel.constants'
import { renderWithProviders } from 'src/modules/duel/duelTestRender'
import { CardStack, DuelState } from 'src/modules/duel/state'

import { deepClone } from 'src/shared/shared.utils'

let preloadedDuel: DuelState

beforeEach(() => {
  preloadedDuel = deepClone(initialDuelStateMock)
})

it('should not render if no duel is initiated', () => {
  const { queryByText } = renderWithProviders(<Board />)

  expect(queryByText(firstPlayerMessage)).toBeFalsy()
})

it('should show versus modal on duel start', () => {
  const { getByText, getAllByText } = renderWithProviders(<Board />, {
    preloadedUser,
    preloadedDuel,
  })

  const {
    players,
    playerOrder: [activePlayerId, inactivePlayerId],
  } = preloadedDuel
  const firstPlayerName = players[activePlayerId].name
  const secondPlayerName = players[inactivePlayerId].name

  expect(getAllByText(firstPlayerName).length).toBeTruthy()
  expect(getAllByText(secondPlayerName).length).toBeTruthy()
  expect(getByText(versusMessage)).toBeTruthy()
  expect(getByText(`${firstPlayerName} ${firstPlayerMessage}`)).toBeTruthy()
})

it('should show player info panels and stack count', () => {
  preloadedDuel.players[playerId].income = 2

  const { getByTestId, getAllByText } = renderWithProviders(<Board />, {
    preloadedUser,
    preloadedDuel,
  })

  const { players, playerOrder } = preloadedDuel

  playerOrder.forEach((playerId) => {
    const { name, coins, income, deck } = players[playerId]

    expect(getByTestId(`${playerId}-info`).textContent).toContain(
      `${name}  ${coins}`,
    )

    expect(getAllByText(`${deckLabel} (${deck.length})`).length).toBeTruthy()

    if (!income) return

    expect(getByTestId(`${playerId}-info`).textContent).toContain(
      `${incomeLabel}${income}`,
    )
  })
})

it(`should draw ${INITIAL_CARDS_DRAWN_IN_DUEL} cards for each player on starting the duel`, () => {
  jest.useFakeTimers()

  preloadedDuel.phase = 'Initial Draw'

  const { act, getAllByText } = renderWithProviders(<Board />, {
    preloadedUser,
    preloadedDuel,
  })

  const { players, playerOrder, cards } = preloadedDuel

  act(() => {
    jest.runAllTimers()
  })

  players[playerId].deck
    .slice(0, INITIAL_CARDS_DRAWN_IN_DUEL)
    .forEach((cardId) => {
      expect(getAllByText(cards[cardId].name).length).toBeTruthy()
    })

  playerOrder.forEach((playerId) => {
    expect(
      getAllByText(
        `${deckLabel} (${players[playerId].deck.length - INITIAL_CARDS_DRAWN_IN_DUEL})`,
      ).length,
    ).toBeTruthy()
  })
})

it('should be able to browse deck and discard stacks', () => {
  jest.useFakeTimers()

  preloadedDuel = deepClone(stackedDuelStateMock)

  const { fireEvent, act, queryByText, getByText } = renderWithProviders(
    <Board />,
    { preloadedUser, preloadedDuel },
  )

  const player = preloadedDuel.players[playerId]
  const browserableStacks: CardStack[] = ['deck', 'discard']

  browserableStacks.forEach((stack: CardStack) => {
    fireEvent.click(
      getByText(`${stackMessageMap[stack]} (${player[stack].length})`),
    )

    expect(getByText(`${browsingStackModalTitle} ${stack}`)).toBeTruthy()
    player[stack].forEach((cardId) =>
      expect(getByText(preloadedDuel.cards[cardId].name)).toBeTruthy(),
    )

    fireEvent.click(getByText(closeMessage))

    act(() => {
      jest.runAllTimers()
    })

    expect(queryByText(`${browsingStackModalTitle} ${stack}`)).toBeFalsy()
    player[stack].forEach((cardId) =>
      expect(queryByText(preloadedDuel.cards[cardId].name)).toBeFalsy(),
    )
  })
})
