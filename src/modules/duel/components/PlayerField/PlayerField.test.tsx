import { fireEvent, within } from '@testing-library/dom'
import { PlayerField } from 'src/modules/duel/components/PlayerField'
import {
  browsingStackModalTitle,
  closeMessage,
} from 'src/modules/duel/components/PlayerField/messages'
import { CARD_STACKS } from 'src/modules/duel/constants'
import { renderWithProviders } from 'src/modules/duel/testRender'
import { CardStack, DuelState, Player } from 'src/modules/duel/types'
import {
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/modules/duel/__mocks__'
import { OVERLAY_TEST_ID } from 'src/shared/test/testIds'
import { deepClone } from 'src/shared/utils'

let preloadedDuel: DuelState
let mockPlayer: Player

beforeEach(() => {
  preloadedDuel = deepClone(stackedDuelStateMock)
  mockPlayer = preloadedDuel.players[preloadedDuel.playerOrder[0]]
})

it('should all ui elements and card stacks', () => {
  const { getByRole, getByTestId } = renderWithProviders(
    <PlayerField playerId={mockPlayer.id} />,
    {
      preloadedUser,
      preloadedDuel,
    },
  )

  const { name, coins, income, id } = mockPlayer

  expect(getByRole('heading', { level: 2 }).textContent).toContain(
    `${name} / ${coins}${income ? ` (+${income})` : ''}`,
  )

  CARD_STACKS.forEach((stack) => {
    expect(getByTestId(`${id}-${stack}`).children).toHaveLength(
      mockPlayer[stack].length,
    )
  })
})

it('should be able to redraw card', () => {
  preloadedDuel.phase = 'Redrawing'

  const { getByText, queryByText } = renderWithProviders(
    <PlayerField playerId={mockPlayer.id} />,
    {
      preloadedUser,
      preloadedDuel,
    },
  )

  const { hand, deck, cards } = mockPlayer

  const putBackCard = cards[hand[0]]

  const drawnCardId = cards[deck[0]]

  expect(queryByText(drawnCardId.name)).toBeFalsy()

  fireEvent.click(getByText(putBackCard.name))

  expect(queryByText(putBackCard.name)).toBeFalsy()
  expect(getByText(drawnCardId.name)).toBeTruthy()
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
  const { hand, cards, id: playerId } = mockPlayer

  const { getByText, getByTestId } = renderWithProviders(
    <PlayerField playerId={playerId} />,
    {
      preloadedUser,
      preloadedDuel,
    },
  )

  const playerCardName = cards[hand[0]].name

  expect(
    within(getByTestId(`${playerId}-hand`)).getByText(playerCardName),
  ).toBeTruthy()

  fireEvent.click(getByText(playerCardName))

  expect(
    within(getByTestId(`${playerId}-hand`)).queryByText(playerCardName),
  ).toBeFalsy()
  expect(
    within(getByTestId(`${playerId}-board`)).getByText(playerCardName),
  ).toBeTruthy()
})

it('should discard an instant when played', () => {
  const { hand, cards, id: playerId } = mockPlayer

  const { getByText, getByTestId, queryByText } = renderWithProviders(
    <PlayerField playerId={playerId} />,
    {
      preloadedUser,
      preloadedDuel,
    },
  )

  const playerCardName = cards[hand[1]].name

  expect(
    within(getByTestId(`${playerId}-hand`)).getByText(playerCardName),
  ).toBeTruthy()

  fireEvent.click(getByText(playerCardName))

  expect(queryByText(playerCardName)).toBeFalsy()
})

it('should attack player with an agent if opponent board is empty', () => {})

it('should attack an agent with an agent if the board is not empty', () => {})
