import { fireEvent } from '@testing-library/dom'
import { act } from 'react'
import {
  DuelState,
  firstPlayerMessage,
  initialDrawMessage,
  renderWithProviders,
} from 'src/modules/duel'
import { DuelModal } from 'src/modules/duel/components'
import {
  initialDuelStateMock,
  userMock as preloadedUser,
} from 'src/shared/__mocks__'
import { OVERLAY_TEST_ID } from 'src/shared/test'
import { deepClone } from 'src/shared/utils'

jest.useFakeTimers()

let preloadedDuel: DuelState

beforeEach(() => {
  preloadedDuel = deepClone(initialDuelStateMock)
})

it('should show when the duel starts then hide', () => {
  const { getByText, getByTestId, queryByTestId } = renderWithProviders(
    <DuelModal />,
    {
      preloadedUser,
      preloadedDuel,
    },
  )

  const { players, playerOrder } = preloadedDuel
  const firstPlayerName = players[playerOrder[0]].name
  const secondPlayerName = players[playerOrder[1]].name

  expect(getByText(`${firstPlayerName} vs ${secondPlayerName}`)).toBeTruthy()
  expect(getByText(initialDrawMessage)).toBeTruthy()
  expect(getByText(`${firstPlayerName} ${firstPlayerMessage}`)).toBeTruthy()

  act(() => {
    jest.runAllTimers()
  })

  fireEvent.animationEnd(getByTestId(OVERLAY_TEST_ID))

  expect(queryByTestId(OVERLAY_TEST_ID)).toBeFalsy()
})
