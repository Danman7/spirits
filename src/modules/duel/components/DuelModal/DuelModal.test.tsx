import { fireEvent } from '@testing-library/dom'
import { act } from 'react'
import {
  initialDuelStateMock,
  userMock as preloadedUser,
} from 'src/__mocks__/duelMocks'
import { DuelModal } from 'src/modules/duel/components/DuelModal'
import { firstPlayerMessage } from 'src/modules/duel/components/DuelModal/DuelModalMessages'
import { renderWithProviders } from 'src/modules/duel/duelTestRender'
import { DuelState } from 'src/modules/duel/state/duelStateTypes'
import { deepClone } from 'src/shared/SharedUtils'
import { OVERLAY_TEST_ID } from 'src/shared/test/testIds'

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

  expect(getByText(firstPlayerName)).toBeTruthy()
  expect(getByText(secondPlayerName)).toBeTruthy()
  expect(getByText(`${firstPlayerName} ${firstPlayerMessage}`)).toBeTruthy()

  act(() => {
    jest.runAllTimers()
  })

  fireEvent.animationEnd(getByTestId(OVERLAY_TEST_ID))

  expect(queryByTestId(OVERLAY_TEST_ID)).toBeFalsy()
})
