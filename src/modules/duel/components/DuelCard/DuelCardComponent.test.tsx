import { fireEvent } from '@testing-library/dom'
import { act } from 'react'
import {
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/__mocks__/DuelMocks'
import { DuelCardComponent } from 'src/modules/duel/components/DuelCard'
import { renderWithProviders } from 'src/modules/duel/DuelTestRender'
import { DuelState, Player } from 'src/modules/duel/DuelTypes'
import { defaultTheme } from 'src/shared/styles/DefaultTheme'
import { CARD_TEST_ID } from 'src/shared/test/testIds'
import { deepClone } from 'src/shared/SharedUtils'

jest.useFakeTimers()

let preloadedDuel: DuelState
let player: Player

beforeEach(() => {
  preloadedDuel = deepClone(stackedDuelStateMock)
  player = preloadedDuel.players[preloadedDuel.playerOrder[0]]
})

const {
  card: { width, height },
} = defaultTheme

it('should show the correct card in hand', () => {
  const { id, hand, cards } = player

  const cardId = hand[0]
  const card = cards[cardId]
  const { name } = card

  const { getByText, getByTestId } = renderWithProviders(
    <DuelCardComponent cardId={cardId} playerId={id} />,
    {
      preloadedUser,
      preloadedDuel,
    },
  )

  expect(getByText(name)).toBeTruthy()

  const cardElementStyle = window.getComputedStyle(
    getByTestId(`${CARD_TEST_ID}${cardId}`),
  )

  expect(cardElementStyle.width).toBe(width)
  expect(cardElementStyle.height).toBe(height)
})

it('should be able to redraw card', () => {
  const { hand, cards, id } = player

  const cardId = hand[0]
  const card = cards[cardId]
  const { name } = card

  preloadedDuel.phase = 'Redrawing'

  const { getByText, queryByText } = renderWithProviders(
    <DuelCardComponent cardId={cardId} playerId={id} />,
    {
      preloadedUser,
      preloadedDuel,
    },
  )

  fireEvent.click(getByText(name))

  act(() => {
    jest.runAllTimers()
  })

  expect(queryByText(name)).toBeFalsy()
})

it('should discard self from board if strength is zero', () => {
  const { board, id, cards } = player
  const cardId = board[0]
  const { name } = cards[cardId]

  if (preloadedDuel.players[id].cards[cardId].type !== 'agent') return

  preloadedDuel.players[id].cards[cardId].strength = 0

  const { queryByText } = renderWithProviders(
    <DuelCardComponent cardId={cardId} playerId={id} />,
    {
      preloadedUser,
      preloadedDuel,
    },
  )

  act(() => {
    jest.runAllTimers()
  })

  expect(queryByText(name)).toBeFalsy()
})
