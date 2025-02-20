import { fireEvent } from '@testing-library/dom'
import {
  DuelState,
  passButtonMessage,
  renderWithProviders,
} from 'src/modules/duel'
import { Board } from 'src/modules/duel/components'
import {
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/shared/__mocks__'
import { CARD_TEST_ID } from 'src/shared/test'
import { Agent } from 'src/shared/types'
import { deepClone } from 'src/shared/utils'

let preloadedDuel: DuelState

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
})

it('should attack an agent with an agent if the board is not empty', () => {
  const { getByText, getByTestId } = renderWithProviders(<Board />, {
    preloadedUser,
    preloadedDuel,
  })

  fireEvent.click(getByText(passButtonMessage))

  const { players, playerOrder } = preloadedDuel
  const { board, cards } = players[playerOrder[1]]

  expect(getByTestId(`${CARD_TEST_ID}${board[0]}`).textContent).toContain(
    `${cards[board[0]].name}${(cards[board[0]] as Agent).strength - 1}`,
  )
})
