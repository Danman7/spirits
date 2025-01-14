import '@testing-library/jest-dom'

import {
  PhaseModal,
  PhaseModalProps,
} from 'src/features/duel/components/PhaseModal'
import {
  opponentFirst,
  playerFirst,
  victoryMessage,
} from 'src/features/duel/messages'

import {
  mockRootState as preloadedState,
  opponentMock,
  userMock,
} from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'

const defaultProps: PhaseModalProps = {
  playerNames: [userMock.name, opponentMock.name],
  isLoggedInPlayerActive: true,
  phase: 'Initial Draw',
  onPhaseModalCloseEnd: jest.fn(),
}

it('should show player names and if player is first on initializing a duel and then hide itself', () => {
  const { getByText } = renderWithProviders(<PhaseModal {...defaultProps} />, {
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
  const { getByText } = renderWithProviders(
    <PhaseModal {...defaultProps} isLoggedInPlayerActive={false} />,
    {
      preloadedState,
    },
  )

  expect(getByText(opponentFirst)).toBeInTheDocument()
})

it("should show the duel victor's name", () => {
  const { getByText } = renderWithProviders(
    <PhaseModal
      {...defaultProps}
      phase="Duel End"
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
