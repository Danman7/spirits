import { fireEvent, waitFor } from '@testing-library/dom'
import {
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/modules/duel/__mocks__'
import { PlayerField } from 'src/modules/duel/components/PlayerField'
import {
  browsingStackModalTitle,
  closeMessage,
} from 'src/modules/duel/components/PlayerField/messages'
import { renderWithProviders } from 'src/modules/duel/testRender'
import { CardStack, DuelState, Player } from 'src/modules/duel/types'
import { OVERLAY_TEST_ID } from 'src/shared/test/testIds'
import { deepClone } from 'src/shared/utils'

let preloadedDuel: DuelState
let mockPlayer: Player

beforeEach(() => {
  preloadedDuel = deepClone(stackedDuelStateMock)
  mockPlayer = preloadedDuel.players[preloadedDuel.playerOrder[0]]
})

it('should all ui elements', () => {
  const { getByRole } = renderWithProviders(
    <PlayerField playerId={mockPlayer.id} />,
    {
      preloadedUser,
      preloadedDuel,
    },
  )

  const { name, coins, income } = mockPlayer

  expect(getByRole('heading', { level: 2 }).textContent).toContain(
    `${name} / ${coins}${income ? ` (+${income})` : ''}`,
  )
})

it('should be able to browse deck and discard stacks', () => {
  const { queryByText, getByText, getByTestId } = renderWithProviders(
    <PlayerField playerId={mockPlayer.id} />,
    {
      preloadedUser,
      preloadedDuel,
    },
  )

  const { id, cards } = mockPlayer
  const browserableStacks: CardStack[] = ['deck', 'discard']

  browserableStacks.forEach((stack: CardStack) => {
    fireEvent.click(getByTestId(`${id}-${stack}`))

    expect(getByText(`${browsingStackModalTitle} ${stack}`)).toBeTruthy()
    mockPlayer[stack].forEach((cardId) =>
      expect(getByText(cards[cardId].name)).toBeTruthy(),
    )

    fireEvent.click(getByText(closeMessage))
    fireEvent.animationEnd(getByTestId(OVERLAY_TEST_ID))

    expect(queryByText(`${browsingStackModalTitle} ${stack}`)).toBeFalsy()
    mockPlayer[stack].forEach((cardId) =>
      expect(queryByText(cards[cardId].name)).toBeFalsy(),
    )
  })
})

it('should be able to play an agent', () => {
  const { hand, board, cards, id: playerId } = mockPlayer

  const { getByText, getByTestId } = renderWithProviders(
    <PlayerField playerId={playerId} />,
    {
      preloadedUser,
      preloadedDuel,
    },
  )

  const playerCardName = cards[hand[0]].name

  waitFor(() =>
    expect(getByTestId(`${playerId}-board`).children).toHaveLength(
      board.length,
    ),
  )

  waitFor(() =>
    expect(getByTestId(`${playerId}-hand`).children).toHaveLength(hand.length),
  )

  fireEvent.click(getByText(playerCardName))

  expect(getByTestId(`${playerId}-board`).textContent).toContain(playerCardName)
  expect(getByTestId(`${playerId}-board`).children).toHaveLength(
    board.length + 1,
  )
  expect(getByTestId(`${playerId}-hand`).children).toHaveLength(hand.length - 1)
  expect(getByTestId(`${playerId}-hand`).textContent).not.toContain(
    playerCardName,
  )
})

it('should discard an instant when played', () => {
  const { hand, discard, board, cards, id: playerId } = mockPlayer

  const { getByText, queryByText, getByTestId } = renderWithProviders(
    <PlayerField playerId={playerId} />,
    {
      preloadedUser,
      preloadedDuel,
    },
  )

  const playerCardName = cards[hand[1]].name

  fireEvent.click(getByText(playerCardName))

  expect(queryByText(playerCardName)).toBeFalsy()

  expect(getByTestId(`${playerId}-discard`).children).toHaveLength(
    discard.length + 1,
  )
  expect(getByTestId(`${playerId}-board`).children).toHaveLength(board.length)
  expect(getByTestId(`${playerId}-hand`).children).toHaveLength(hand.length - 1)
  expect(getByTestId(`${playerId}-hand`).textContent).not.toContain(
    playerCardName,
  )
})
