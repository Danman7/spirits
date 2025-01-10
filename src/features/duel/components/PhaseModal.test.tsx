import '@testing-library/jest-dom'

import { RootState } from 'src/app/store'
import {
  PhaseModal,
  PhaseModalProps,
} from 'src/features/duel/components/PhaseModal'
import {
  opponentFirst,
  playerFirst,
  victoryMessage,
} from 'src/features/duel/messages'
import { MockPlayerTurnState, opponentId, playerId } from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'

const defaultProps: PhaseModalProps = {
  players: MockPlayerTurnState.players,
  isLoggedInPlayerActive: true,
  phase: 'Initial Draw',
  onPhaseModalCloseEnd: jest.fn(),
}

const preloadedState: Partial<RootState> = {
  duel: MockPlayerTurnState,
}

const playerName = MockPlayerTurnState.players[playerId].name
const opponentName = MockPlayerTurnState.players[opponentId].name

it('should show player names and if player is first on initializing a duel and then hide itself', () => {
  const { getByText } = renderWithProviders(<PhaseModal {...defaultProps} />, {
    preloadedState,
  })

  expect(getByText(`${playerName} vs ${opponentName}`)).toBeInTheDocument()
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
    <PhaseModal {...defaultProps} victoriousPlayerName={playerName} />,
    {
      preloadedState,
    },
  )

  expect(getByText(`${playerName} ${victoryMessage}`)).toBeInTheDocument()
})
