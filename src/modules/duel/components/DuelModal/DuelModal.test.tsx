import { fireEvent } from '@testing-library/dom'
import { act } from 'react'
import { DuelModal } from 'src/modules/duel/components/DuelModal'
import {
  firstPlayerMessage,
  initialDrawMessage,
} from 'src/modules/duel/components/DuelModal/messages'
import { renderWithProviders } from 'src/modules/duel/testRender'
import { DuelState } from 'src/modules/duel/types'
import {
  initialDuelStateMock,
  userMock as preloadedUser,
} from 'src/modules/duel/__mocks__'
import { OVERLAY_TEST_ID } from 'src/shared/test/testIds'
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
