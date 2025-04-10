import {
  playerId,
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/modules/duel/__mocks__'
import { Board } from 'src/modules/duel/components'
import { logsTitle } from 'src/modules/duel/components/Board/PlayerField/LogsPanel/LogsPanel.messages'
import { normalizeStateCards } from 'src/modules/duel/duel.utils'
import { renderWithProviders } from 'src/modules/duel/duelTestRender'
import { DuelState } from 'src/modules/duel/state'
import {
  boostedLogMessage,
  playedLogMessage,
  reduceCounterLogMessage,
} from 'src/modules/duel/state/playLogs'

import {
  Agent,
  AgentWithCounter,
  BrotherSachelman,
  CardBaseKey,
  CardBases,
  ElevatedAcolyte,
  HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
  HighPriestMarkander,
} from 'src/shared/modules/cards'
import { deepClone } from 'src/shared/shared.utils'

let preloadedDuel: DuelState
let baseName: CardBaseKey

beforeEach(() => {
  jest.useFakeTimers()
  preloadedDuel = deepClone(stackedDuelStateMock)
})

afterEach(() => {
  jest.useRealTimers()
})

describe(BrotherSachelman.name, () => {
  let base: Agent

  beforeEach(() => {
    baseName = 'BrotherSachelman'
    base = CardBases[baseName]
  })

  it('should boost all allied Hammerites on board that have lower strength', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: {
        hand: [baseName],
        board: ['HammeriteNovice', 'HammeriteNovice'],
      },
    })

    const { fireEvent, getByText, getByTestId, getByRole } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    fireEvent.click(getByText(base.name))

    const { players } = preloadedDuel
    const { hand } = players[playerId]

    expect(getByTestId(hand[0]).textContent).toContain(
      `${base.name}${base.strength}`,
    )

    fireEvent.click(getByText(logsTitle))

    preloadedDuel.players[playerId].board.forEach((cardId) => {
      const { strength, name } = preloadedDuel.cards[cardId] as Agent

      expect(getByTestId(cardId).textContent).toContain(
        `${name}${strength + HAMMERITES_WITH_LOWER_STRENGTH_BOOST}`,
      )

      expect(getByRole('log').textContent).toContain(
        `${name}${boostedLogMessage}${HAMMERITES_WITH_LOWER_STRENGTH_BOOST}`,
      )
    })
  })

  it('should not boost non-Hammerite agents or Hammerites with highet strength', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: [baseName], board: ['HouseGuard', 'TempleGuard'] },
    })

    const { fireEvent, getByText, getByTestId } = renderWithProviders(
      <Board />,
      { preloadedUser, preloadedDuel },
    )

    fireEvent.click(getByText(base.name))

    preloadedDuel.players[playerId].board.forEach((cardId) => {
      const { strength, name } = preloadedDuel.cards[cardId] as Agent

      expect(getByTestId(cardId).textContent).toContain(`${name}${strength}`)
    })
  })
})

describe(HighPriestMarkander.name, () => {
  let base: Agent

  beforeEach(() => {
    baseName = 'HighPriestMarkander'
    base = CardBases[baseName]
  })

  it('should reduce the counter if a Hammerite is played', async () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: [baseName, 'ElevatedAcolyte'] },
    })

    const { fireEvent, act, getByRole, getByText } = renderWithProviders(
      <Board />,
      { preloadedUser, preloadedDuel },
    )

    expect(getByText(base.counter as number)).toBeTruthy()

    fireEvent.click(getByText(ElevatedAcolyte.name))

    act(() => {
      jest.runAllTimers()
    })

    const expectedReducedCounter = (base.counter as number) - 1

    expect(getByText(expectedReducedCounter)).toBeTruthy()

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).toContain(
      `${base.name}${reduceCounterLogMessage}${expectedReducedCounter}`,
    )
  })

  it('should play High Priest Markander from deck if counter reaches 0', async () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: ['ElevatedAcolyte'], deck: [baseName] },
    })

    const HighPriestId = preloadedDuel.players[playerId].deck[0]
    const HighPriest = preloadedDuel.cards[HighPriestId] as AgentWithCounter

    HighPriest.counter = 1

    const { fireEvent, act, getAllByText, getByText, queryByText, getByRole } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    expect(queryByText(base.name)).toBeFalsy()

    fireEvent.click(getByText(ElevatedAcolyte.name))

    act(() => {
      jest.runAllTimers()
    })

    expect(getAllByText(base.name)).toHaveLength(1)

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).toContain(
      `${base.name}${playedLogMessage}`,
    )
  })

  it('should not play High Priest Markander from discard if counter reaches 0', async () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: ['ElevatedAcolyte'], discard: [baseName] },
    })

    const HighPriestId = preloadedDuel.players[playerId].discard[0]
    const HighPriest = preloadedDuel.cards[HighPriestId] as AgentWithCounter

    HighPriest.counter = 1

    const { fireEvent, act, getByText, queryByText, getByRole } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    expect(queryByText(base.name)).toBeFalsy()

    fireEvent.click(getByText(ElevatedAcolyte.name))

    act(() => {
      jest.runAllTimers()
    })

    expect(queryByText(base.name)).toBeFalsy()

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).not.toContain(
      `${base.name}${playedLogMessage}`,
    )
  })
})
