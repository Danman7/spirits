import { fireEvent, waitFor } from '@testing-library/dom'

import {
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/modules/duel/__mocks__'
import { PlayCard } from 'src/modules/duel/components/Board/PlayerField/PlayCard'
import { Player } from 'src/modules/duel/duel.types'
import { renderWithProviders } from 'src/modules/duel/duelTestRender'
import type { DuelState } from 'src/modules/duel/state'

import { deepClone } from 'src/shared/shared.utils'
import { defaultTheme } from 'src/shared/styles'
import { CARD_TEST_ID } from 'src/shared/test/testIds'

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
    <PlayCard cardId={cardId} playerId={id} />,
    { preloadedUser, preloadedDuel },
  )

  expect(getByText(name)).toBeTruthy()

  const cardElementStyle = window.getComputedStyle(
    getByTestId(`${CARD_TEST_ID}${cardId}`),
  )

  expect(cardElementStyle.width).toBe(`${width}px`)
  expect(cardElementStyle.height).toBe(`${height}px`)
})

it('should be able to redraw card', async () => {
  const { hand, id } = player

  const cardId = hand[0]
  const card = preloadedDuel.cards[cardId]
  const { name } = card

  preloadedDuel.phase = 'Redrawing'

  const { getByText, queryByText } = renderWithProviders(
    <PlayCard cardId={cardId} playerId={id} />,
    { preloadedUser, preloadedDuel },
  )

  fireEvent.click(getByText(name))

  await waitFor(() => {
    expect(queryByText(name)).toBeFalsy()
  })
})

it('should discard self from board if strength is zero', async () => {
  const { board, id } = player
  const cardId = board[0]
  const { name } = preloadedDuel.cards[cardId]

  if (preloadedDuel.cards[cardId].type !== 'agent') return

  preloadedDuel.cards[cardId].strength = 0

  const { queryByText } = renderWithProviders(
    <PlayCard cardId={cardId} playerId={id} />,
    { preloadedUser, preloadedDuel },
  )

  await waitFor(() => {
    expect(queryByText(name)).toBeFalsy()
  })
})
