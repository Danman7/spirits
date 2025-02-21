import { fireEvent } from '@testing-library/dom'
import { passButtonMessage } from 'src/modules/duel/components/ActionPanel/messages'
import { Board } from 'src/modules/duel/components/Board'
import { renderWithProviders } from 'src/modules/duel/testRender'
import { DuelState } from 'src/modules/duel/types'
import {
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/modules/duel/__mocks__'
import { Agent } from 'src/shared/modules/cards/types'
import { CARD_TEST_ID } from 'src/shared/test/testIds'
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
