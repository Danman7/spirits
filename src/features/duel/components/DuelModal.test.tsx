import { fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { RootState } from 'src/app/store'
import {
  DuelModal,
  DuelModalProps,
} from 'src/features/duel/components/DuelModal'
import {
  closeMessage,
  opponentFirst,
  playerFirst,
  victoryMessage,
} from 'src/features/duel/messages'
import { setBrowsedStack } from 'src/features/duel/slice'
import { opponentMock, stackedStateMock, userMock } from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'
import { deepClone } from 'src/shared/utils'

const defaultProps: DuelModalProps = {
  playerNames: [userMock.name, opponentMock.name],
  isLoggedInPlayerActive: true,
  onDuelModalCloseEnd: jest.fn(),
}

let preloadedState: RootState

beforeEach(() => {
  preloadedState = deepClone(stackedStateMock)
})

it('should show player names and if player is first on initializing a duel and then hide itself', () => {
  preloadedState.duel.phase = 'Initial Draw'

  const { getByText } = renderWithProviders(<DuelModal {...defaultProps} />, {
    preloadedState,
  })

  expect(
    getByText(
      `${defaultProps.playerNames[0]} vs ${defaultProps.playerNames[1]}`,
    ),
  ).toBeInTheDocument()
  expect(getByText(playerFirst)).toBeInTheDocument()
})

it('should show that opponent is first if they win coin toss', () => {
  preloadedState.duel.phase = 'Initial Draw'

  const { getByText } = renderWithProviders(
    <DuelModal {...defaultProps} isLoggedInPlayerActive={false} />,
    {
      preloadedState,
    },
  )

  expect(getByText(opponentFirst)).toBeInTheDocument()
})

it("should show the duel victor's name", () => {
  preloadedState.duel.phase = 'Duel End'

  const { getByText } = renderWithProviders(
    <DuelModal
      {...defaultProps}
      victoriousPlayerName={defaultProps.playerNames[0]}
    />,
    {
      preloadedState,
    },
  )

  expect(
    getByText(`${defaultProps.playerNames[0]} ${victoryMessage}`),
  ).toBeInTheDocument()
})

it("should be able to browse the player's deck", async () => {
  preloadedState.duel.browsedStack = 'deck'

  const { getByText, dispatchSpy } = renderWithProviders(
    <DuelModal {...defaultProps} />,
    {
      preloadedState,
    },
  )

  const { players, activePlayerId } = preloadedState.duel
  const player = players[activePlayerId]

  expect(getByText(player.cards[player.deck[0]].name)).toBeInTheDocument()

  fireEvent.click(getByText(closeMessage))

  expect(dispatchSpy).toHaveBeenCalledWith(setBrowsedStack(''))
})

it("should be able to browse the player's discard", async () => {
  preloadedState.duel.browsedStack = 'discard'

  const { getByText } = renderWithProviders(<DuelModal {...defaultProps} />, {
    preloadedState,
  })

  const { players, activePlayerId } = preloadedState.duel
  const player = players[activePlayerId]

  expect(getByText(player.cards[player.discard[0]].name)).toBeInTheDocument()
})
