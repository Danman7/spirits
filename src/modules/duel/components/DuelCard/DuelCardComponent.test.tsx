import { fireEvent } from '@testing-library/dom'
import { act } from 'react'
import {
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/__mocks__/duelMocks'
import { DuelCardComponent } from 'src/modules/duel/components/DuelCard'
import { renderWithProviders } from 'src/modules/duel/duelTestRender'
import { defaultTheme } from 'src/shared/styles/DefaultTheme'
import { CARD_TEST_ID } from 'src/shared/test/testIds'
import { deepClone } from 'src/shared/SharedUtils'
import { DuelState } from 'src/modules/duel/state/duelStateTypes'
import { Player } from 'src/modules/duel/playerTypes'

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
  const { id, hand } = player

  const cardId = hand[0]
  const card = preloadedDuel.cards[cardId]
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
  const { hand, id } = player

  const cardId = hand[0]
  const card = preloadedDuel.cards[cardId]
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
  const { board, id } = player
  const cardId = board[0]
  const { name } = preloadedDuel.cards[cardId]

  if (preloadedDuel.cards[cardId].type !== 'agent') return

  preloadedDuel.cards[cardId].strength = 0

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
